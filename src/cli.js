/*
! NPM USAGE
------------------------------------------------------------------
 * This CLI is using npm link to scope the package to the project locally for easier development.
 
 * The CLI is published as a NPM package.
------------------------------------------------------------------
 */

import arg from "arg";
import inquirer from "inquirer";
import { createProject } from "./main";

/*  
! Options Parsing
------------------------------------------------------------------
 *  This function is used to parse the arguments passed to the cli
 * as flags
------------------------------------------------------------------
 */

function parseArgumentsIntoOptions(rawArgs) {
  const args = arg(
    {
      "--yes": Boolean,
      "--install": Boolean,
      "-y": "--yes",
      "-i": "--install",
    },
    {
      argv: rawArgs.slice(2),
    }
  );
  return {
    skipPrompts: args["--yes"] || false,
    template: args._[0],
    install: args["--install"] || false,
  };
}

/*  
! Missing Options 
------------------------------------------------------------------
*  This function is used to prompt the user for options not passed 
* as flags to the cli. It is async so that the missing options can 
* be asked for 1 by 1 
 
*  Finally it takes the responses from the user and returns
* The options that were selected by the user
------------------------------------------------------------------
 */

async function promptForMssingOptions(options) {
  const defaultTemplate = "NextJS";
  const defaultProjectName = "my-super-cool-project";

  if (options.skipPrompts) {
    return {
      ...options,
      template: options.template || defaultTemplate,
      projectName: options.projectName || defaultProjectName,
    };
  }

  const questions = [];

  questions.push({
    type: "input",
    required: true,
    name: "projectName",
    message: "What do you want to name this world changing project?",
    default: defaultProjectName,
  });

  if (!options.template) {
    questions.push({
      type: "list",
      name: "template",
      message: "Pick your poison",
      choices: ["react", "react-typescript", "nextjs", "nextjs-typescript"],
      default: defaultTemplate,
    });
  }

  if (!options.install) {
    questions.push({
      type: "confirm",
      name: "install",
      message: "Install dependencies?",
      default: false,
    });
  }

  const answers = await inquirer.prompt(questions);
  return {
    ...options,
    projectName: options.projectName || answers.projectName,
    template: options.template || answers.template,
    install: options.install || answers.install,
  };
}

/* 
! Point of Entry
------------------------------------------------------------
*   This function creates an "options" variable which calls 
* the parseArgumentsIntoOptions function and passes it 
* the arguments chosen from the cli prompts. 
------------------------------------------------------------
 */

export async function cli(args) {
  let options = parseArgumentsIntoOptions(args);
  options = await promptForMssingOptions(options);
  await createProject(options);
}
