const MAX_ATTEMPTS = 4;
const RETRY_DELAY_MS = 250;
const PAGE_SIZE = 100;

function createFailureJobUrlResolver({
  fetchImpl = fetch,
  token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN,
  sleep = ms => new Promise(resolve => setTimeout(resolve, ms)),
} = {}) {
  const jobsByRun = new Map();

  async function fetchJobs(repository, runId) {
    const jobs = [];
    const headers = { Accept: 'application/vnd.github+json' };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    for (let page = 1; ; page += 1) {
      const url = `https://api.github.com/repos/${repository}/actions/runs/${runId}/jobs?per_page=${PAGE_SIZE}&page=${page}`;
      let response;
      for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt += 1) {
        response = await fetchImpl(url, { headers });
        if (response.ok) {
          break;
        }

        const errorMessage = await response.text();
        if (response.status < 500 || response.status > 599 || attempt === MAX_ATTEMPTS - 1) {
          throw new Error(`GitHub Actions API request failed: ${response.status} ${errorMessage}`);
        }

        await sleep(RETRY_DELAY_MS * 2 ** attempt);
      }

      const result = await response.json();
      if (!Array.isArray(result.jobs)) {
        throw new Error(`GitHub Actions API returned no jobs for workflow run ${runId}`);
      }

      jobs.push(...result.jobs);
      if (result.jobs.length < PAGE_SIZE) {
        return jobs;
      }
    }
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
    const cacheKey = `${repository}/${runId}`;
    if (!jobsByRun.has(cacheKey)) {
      jobsByRun.set(cacheKey, fetchJobs(repository, runId));
    }

    const jobName = `[${platform.toLowerCase()}] ${library}`;
    const jobs = await jobsByRun.get(cacheKey);
    const job = jobs.find(candidate => candidate.name === jobName || candidate.name.endsWith(` / ${jobName}`));
    const failedStep = job?.steps?.find(step => step.conclusion === 'failure');

    if (!job || !failedStep) {
      throw new Error(`Could not find a failed GitHub Actions step for ${jobName} in workflow run ${runId}`);
    }

    return `${url.origin}/${repository}/actions/runs/${runId}/job/${job.id}#step:${failedStep.number}:1`;
  };
}

export { createFailureJobUrlResolver };
