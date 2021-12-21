import chalk from "chalk";
import fs from "fs";
import Listr from "listr";
import { projectInstall } from "pkg-install";
import degit from "degit";

/* This is the main entry point of the CLI 
This takes the options from the user / flags and 
creates a new project based on the options
*/

export async function createProject(options) {
  options = {
    ...options,
  };
  // console.log(options);

  /* 
  Degit is the package that pulls the repo 
  from the remote and creates a new project 
  with none of the personal information 
  attached to the repo. 

  In this case I have 4 template repos on GH that are just
  there as the endpoints for the CLI to pull from.
  */

  const emitter = degit(`ZachCodedThat/zp-${options.template}-template`, {
    cache: false,
    force: true,
    verbose: true,
  });

  emitter.clone(`${options.projectName}`).then(() => {
    const pkg = JSON.parse(
      fs.readFileSync(`${options.projectName}/package.json`, "utf8")
    );
    if (pkg && pkg.name) {
      pkg.name = `${options.projectName}`;
      fs.writeFileSync(
        `${options.projectName}/package.json`,
        JSON.stringify(pkg, null, 2)
      );
    }
  });

  /* 
  Listr is a package that allows you to create a list of tasks
  per the options passed to the CLI prompts / flags. 

  It allows us to display differing mesages / progress outputs 
  based on the options / flags passed to the CLI.

  and allows us further messages upon completion/failue of the tasks 
  */

  const tasks = new Listr([
    {
      title: "Install dependencies",
      task: () =>
        projectInstall({
          cwd: options.projectName,
        }),
      skip: () => {
        if (!options.install) {
          return "Don't forget to install dependencies!!";
        }
      },
    },
  ]);

  await tasks.run().catch((err) => {
    console.error(chalk.red(err));
  });

  console.log("%s Project ready", chalk.green.bold("DONE"));
  return true;
}
