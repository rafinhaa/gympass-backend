import { Options } from "tsup";

const options: Options = {
  entry: ["src", "!src/**/__tests__"],
  outDir: "build",
  clean: true,
  minify: true,
};

export default options;
