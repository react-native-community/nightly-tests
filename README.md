# React Native Nightly Tests 🌑🌓🌔🌕🌖🌗

[![Check Nightlies](https://github.com/react-native-community/nightly-tests/actions/workflows/check-nightly.yml/badge.svg)](https://github.com/react-native-community/nightly-tests/actions/workflows/check-nightly.yml)

Automated GitHub Actions workflows for testing React Native ecosystem libraries against nightly builds.

## Overview

This repository contains GitHub Actions workflows that automatically test **popular React Native OSS libraries** against React Native **nightly builds**. The system runs daily to catch breaking changes early and ensure ecosystem compatibility with upcoming React Native releases.

Specifically this repo will:
- Run a daily job **every night at 4:15 AM UTC** via GitHub Actions scheduled workflows
- Testing the latest `react-native@nightly` build against a list of popular libraries, such as:
  - `react-native-async-storage`
  - `react-native-gesture-handler`
  - `react-native-reanimated`
  - And many more...
- Run a build for both Android and iOS
- Send a Discord message for failure alerts and status updates
- Store results in Firebase for historical tracking and run comparison to identify newly broken or recovered libraries

### Website

The test results are also published on the website, which is available on the following address:
* https://react-native-community.github.io/nightly-tests/

To learn more about website app, see [the README file](./website/README.md) in the `website` directory.

## Contributing

The repository includes Jest tests for the workflow scripts. To run the tests locally, use the following commands:

```bash
yarn install && yarn test
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
