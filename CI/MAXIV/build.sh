#!/usr/bin/env bash

cp CI/MAXIV/favicon.ico src
cp CI/MAXIV/theme.scss src

./node_modules/@angular/cli/bin/ng build --env=maxiv-prod
