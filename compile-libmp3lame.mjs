import { execSync } from "child_process";
import fs, { existsSync, mkdirSync, unlinkSync, writeFileSync } from "fs";
import path from "path";
import { PREFIX } from "./const.mjs";

export const enableLibMp3Lame = (isMusl, isWindows) => {
  if (!fs.existsSync("libmp3lame")) {
    // Using newer than 3.100 because it has support for aarch64
    execSync("unzip libmp3lame.zip -d libmp3lame", {
      stdio: "inherit",
    });
  }

  execSync(
    [
      path.posix.join(
        process.cwd().replace(/\\/g, "/"),
        "libmp3lame",
        "configure"
      ),
      `--prefix=${path.join(process.cwd(), "libmp3lame", PREFIX)}`,
      "--enable-static",
      "--disable-shared",
      "--enable-nasm",
      "--disable-rpath",
      isWindows
        ? "--host=x86_64-w64-mingw32 --cross-prefix=x86_64-w64-mingw32-"
        : null,
      isMusl ? '--extra-cxxflags="-static-libgcc -static-libstdc++"' : null,
      isMusl ? '--extra-ldexeflags="-static-libgcc -static-libstdc++"' : null,
    ]
      .filter(Boolean)
      .join(" "),
    {
      cwd: "libmp3lame",
      stdio: "inherit",
    }
  );

  execSync("make", {
    cwd: "libmp3lame",
    stdio: "inherit",
  });

  execSync("make install", {
    cwd: "libmp3lame",
    stdio: "inherit",
  });

  unlinkSync("libmp3lame/remotion/lib/libmp3lame.la");
  unlinkSync("libmp3lame/remotion/bin/lame");
  unlinkSync("libmp3lame/remotion/share");

  execSync(`cp -r ${PREFIX} ../`, { cwd: "libmp3lame", stdio: "inherit" });
};
