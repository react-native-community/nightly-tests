const MAX_ATTEMPTS = 4;
const RETRY_DELAY_MS = 250;

function createFailureJobUrlResolver({
  fetchImpl = fetch,
  token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN,
  sleep = ms => new Promise(resolve => setTimeout(resolve, ms)),
} = {}) {
  const jobsByRun = new Map();

  async function fetchJobsPage(url, headers) {
    for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt += 1) {
      const response = await fetchImpl(url, { headers });
      if (response.ok) {
        return response;
      }

      const error = new Error(`GitHub Actions API request failed: ${response.status} ${await response.text()}`);
      if (response.status < 500 || response.status > 599 || attempt === MAX_ATTEMPTS - 1) {
        throw error;
      }

      await sleep(RETRY_DELAY_MS * 2 ** attempt);
    }

    throw new Error('GitHub Actions API request failed after retries');
  }

  async function getJobs(apiOrigin, repository, runId) {
    const key = `${apiOrigin}/${repository}/actions/runs/${runId}`;
    if (!jobsByRun.has(key)) {
      jobsByRun.set(
        key,
        (async () => {
          const jobs = [];
          let page = 1;
          let pageJobs;

          do {
            const headers = { Accept: 'application/vnd.github+json' };
            if (token) {
              headers.Authorization = `Bearer ${token}`;
            }

            const response = await fetchJobsPage(
              `${apiOrigin}/repos/${repository}/actions/runs/${runId}/jobs?per_page=100&page=${page}`,
              headers
            );

            const result = await response.json();
            if (!Array.isArray(result.jobs)) {
              throw new Error(`GitHub Actions API returned no jobs for workflow run ${runId}`);
            }

            pageJobs = result.jobs;
            jobs.push(...pageJobs);
            page += 1;
          } while (pageJobs.length === 100);

          return jobs;
        })()
      );
    }

    return jobsByRun.get(key);
  }

  return async function resolveFailureJobUrl({ library, platform, runUrl }) {
    if (!runUrl) {
      throw new Error(`Missing workflow run URL for [${platform.toLowerCase()}] ${library}`);
    }

    const url = new URL(runUrl);
    if (url.protocol !== 'https:' || url.hostname !== 'github.com') {
      throw new Error(`Unsupported GitHub Actions URL: ${runUrl}`);
    }

    if (/\/job\/\d+$/.test(url.pathname) && /^#step:\d+:\d+$/.test(url.hash)) {
      return runUrl;
    }

    const runMatch = url.pathname.match(/^\/([^/]+\/[^/]+)\/actions\/runs\/(\d+)(?:\/|$)/);
    if (!runMatch) {
      throw new Error(`Invalid GitHub Actions run URL: ${runUrl}`);
    }

    const [, repository, runId] = runMatch;
    const apiOrigin = 'https://api.github.com';
    const jobs = await getJobs(apiOrigin, repository, runId);
    const jobName = `[${platform.toLowerCase()}] ${library}`;
    const job = jobs.find(candidate => candidate.name === jobName || candidate.name.endsWith(` / ${jobName}`));
    const failedStep = job?.steps?.find(step => step.conclusion === 'failure');

    if (!job || !failedStep) {
      throw new Error(`Could not find a failed GitHub Actions step for ${jobName} in workflow run ${runId}`);
    }

    return `${url.origin}/${repository}/actions/runs/${runId}/job/${job.id}#step:${failedStep.number}:1`;
  };
}

export { createFailureJobUrlResolver };
