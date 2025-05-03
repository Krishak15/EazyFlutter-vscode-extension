"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateDartModel = generateDartModel;
const fs = __importStar(require("fs"));
const quicktype_core_1 = require("quicktype-core");
// Generate Dart model from JSON using quicktype
async function generateDartModel(jsonPath, className, outputPath, jsonInputTL) {
    try {
        const jsonData = fs.readFileSync(jsonPath, "utf-8");
        const jsonInput = jsonInputTL("dart");
        await jsonInput.addSource({ name: className, samples: [jsonData] });
        const inputData = new quicktype_core_1.InputData();
        inputData.addInput(jsonInput);
        const result = await (0, quicktype_core_1.quicktype)({
            inputData,
            lang: "dart",
            rendererOptions: {
                "just-types": false,
                "use-json-annotation": true,
            },
        });
        fs.writeFileSync(outputPath, result.lines.join("\n"), "utf-8");
    }
    catch (error) {
        console.error("Error generating Dart model:", error);
    }
}
//# sourceMappingURL=json_convertor.js.map