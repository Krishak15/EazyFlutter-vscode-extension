import * as fs from "fs";
import { InputData, quicktype } from "quicktype-core";

// Generate Dart model from JSON using quicktype
export async function generateDartModel(
  jsonPath: string,
  className: string,
  outputPath: string,
  jsonInputTL: any
): Promise<void> {
  try {
    const jsonData: string = fs.readFileSync(jsonPath, "utf-8");
    const jsonInput = jsonInputTL("dart");
    await jsonInput.addSource({ name: className, samples: [jsonData] });

    const inputData = new InputData();
    inputData.addInput(jsonInput);

    const result = await quicktype({
      inputData,
      lang: "dart",
      rendererOptions: {
        "just-types": false,
        "use-json-annotation": true,
      },
    });

    fs.writeFileSync(outputPath, result.lines.join("\n"), "utf-8");
  } catch (error) {
    console.error("Error generating Dart model:", error);
  }
}