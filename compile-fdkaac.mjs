import fs from "fs";
import { execSync } from "child_process";
import { PREFIX } from "./const.mjs";
import path from "path";

export const enableFdkAac = async (isWindows) => {
  if (!fs.existsSync("fdkaac")) {
    const response = execSync(
      "curl -L https://github.com/mstorsjo/fdk-aac/archive/refs/tags/v2.0.2.tar.gz > fdkaac.tar.gz"
    );
    execSync("tar -xzf fdkaac.tar.gz", {
      stdio: "inherit",
    });
  }

  execSync(
    [
      path.posix.join(
        process.cwd().replace(/\\/g, "/"),
        "fdk-aac-2.0.2",
        "configure"
      ),
      `--prefix=${path.resolve("fdk-aac-2.0.2", PREFIX)}`,
      "--enable-static",
      "--disable-shared",
      "--with-pic",
      isWindows ? "--host=x86_64-w64-mingw32" : null,
    ]
      .filter(Boolean)
      .join(" "),
    {
      cwd: "fdk-aac-2.0.2",
      stdio: "inherit",
    }
  );

  execSync("make", {
    cwd: "fdk-aac-2.0.2",
    stdio: "inherit",
  });

  execSync("make install", {
    cwd: "fdk-aac-2.0.2",
    stdio: "inherit",
  });

  execSync(`cp -r ${PREFIX} ../`, { cwd: "fdk-aac-2.0.2", stdio: "inherit" });
};
