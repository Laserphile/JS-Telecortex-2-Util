This is a basic util library to share code between the client and server libraries for [JS-Telecortex-2](https://github.com/Laserphile/JS-Telecortex-2)

[![Build Status](https://travis-ci.org/Laserphile/JS-Telecortex-2-Util.svg?branch=master)](https://travis-ci.org/Laserphile/JS-Telecortex-2-Util)
[![Maintainability](https://api.codeclimate.com/v1/badges/4172f27f149a4c7f4201/maintainability)](https://codeclimate.com/github/Laserphile/JS-Telecortex-2-Util/maintainability)
[![codecov](https://codecov.io/gh/Laserphile/JS-Telecortex-2-Util/branch/master/graph/badge.svg)](https://codecov.io/gh/Laserphile/JS-Telecortex-2-Util)

# To recompile modifications made to this package when installed under node_modules

```
yarn global add @babel/cli @babel/core
export PATH="$PATH:$(yarn global bin)"
cd node_modules/@js-telecortex-2/js-telecortex-2-util/
babel src --out-dir lib
```
