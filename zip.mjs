import { execSync } from "child_process";
import { copyFileSync, readdirSync, renameSync, unlinkSync } from "fs";
import path from "path";
import { PREFIX } from "./const.mjs";

const isWindows = process.argv[2] === "windows";

if (isWindows) {
  const remotionBinDir = path.join(process.cwd(), "remotion", "bin");
  const remotionLibDir = path.join(process.cwd(), "remotion", "lib");
  copyFileSync(
    "libwinpthread-1.dll",
    path.join(remotionLibDir, "libwinpthread-1.dll")
  );
  copyFileSync("libvpx-1.dll", path.join(remotionLibDir, "libvpx-1.dll"));
  copyFileSync("zlib1.dll", path.join(remotionLibDir, "zlib1.dll"));
  copyFileSync("libssp-0.dll", path.join(remotionLibDir, "libssp-0.dll"));
  copyFileSync("libstdc++-6.dll", path.join(remotionLibDir, "libstdc++-6.dll"));
  const binFiles = readdirSync(remotionBinDir);
  for (const file of binFiles) {
    if (file.endsWith(".lib")) {
      const oldPath = path.join(remotionBinDir, file);
      unlinkSync(oldPath);
    } else if (file.endsWith(".dll")) {
      const oldPath = path.join(remotionBinDir, file);
      const newPath = path.join(remotionBinDir, "..", "lib", file);

      console.log(oldPath, newPath);
      renameSync(oldPath, newPath);
    }
  }

  const libFiles = readdirSync(remotionLibDir);
  for (const file of libFiles) {
    if (file.endsWith(".def")) {
      unlinkSync(path.join(remotionLibDir, file));
    }
  }
}

execSync(`tar cvzf ffmpeg.tar.gz ${PREFIX} bindings.rs`, {
  stdio: "inherit",
});
