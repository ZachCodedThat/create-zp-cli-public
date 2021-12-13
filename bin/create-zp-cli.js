#!/usr/bin/env node

require = require("esm")(module /*, options*/);
require("../src/cli.js").cli(process.argv);

/*
! ES Modules 
--------------------------------------------------------------------------------
 *   This is a simple script that allows the use of ES Modules and use import 
 *  statements in other files and not have to do backflips to make sure 
 *  the proper node version is used.
 
 *  This uses the module "esm"
--------------------------------------------------------------------------------
 */
