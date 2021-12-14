import chalk from "chalk";
import fs from "fs";
import Listr from "listr";
import { projectInstall } from "pkg-install";
import degit from "degit";

export async function createProject(options) {
  options = {
    ...options,
  };
  // console.log(options);

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
