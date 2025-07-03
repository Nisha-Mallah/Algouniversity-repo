const express = require('express');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const CONTAINER_NAME = 'keen_jang';

router.post('/', async (req, res) => {
  const { language, code, testCases } = req.body;

  const SUPPORTED_LANGUAGES = ['python', 'javascript', 'java'];
  if (!SUPPORTED_LANGUAGES.includes(language)) {
    return res.status(400).json({ error: 'Unsupported language.' });
  }

  const results = [];
  let runCommand = '';

  try {
    for (const test of testCases) {
      const input = test.input;
      const expectedOutput = test.expectedOutput;

      const fileExtension =
        language === 'python' ? '.py' : language === 'javascript' ? '.js' : '.java';

      const tempHostDir = 'C:\\online-judge-tmp';
      const tempContainerDir = '/code-tmp';
      const tempFileName = `code${fileExtension}`;
      const tempFilePath = path.join(tempHostDir, tempFileName);

      if (fs.existsSync(tempFilePath)) fs.unlinkSync(tempFilePath);

      const inputObj = JSON.parse(input);
      const argList = Object.keys(inputObj).map(key => JSON.stringify(inputObj[key])).join(', ');

      let wrappedCode = '';

      if (language === 'python') {
        wrappedCode = `
${code}

if __name__ == "__main__":
    print(main(${argList}))
`;
      } else if (language === 'javascript') {
        wrappedCode = `
${code}

console.log(main(${argList}));
`;
      } else if (language === 'java') {
        const javaArgs = Object.values(inputObj)
          .map(value => {
            if (Array.isArray(value)) {
              return `new int[]{${value.join(',')}}`;
            } else if (typeof value === 'string') {
              return `"${value}"`;
            } else if (typeof value === 'boolean') {
              return value ? 'true' : 'false';
            } else {
              return value;
            }
          })
          .join(', ');

        wrappedCode = `
import java.util.*;

public class code {
    public static void main(String[] args) {
        Object result = Solution.main(${javaArgs});
        if (result != null && result.getClass().isArray()) {
            if (result instanceof int[]) {
                System.out.println(Arrays.toString((int[]) result));
            } else if (result instanceof String[]) {
                System.out.println(Arrays.toString((String[]) result));
            } else if (result instanceof Object[]) {
                System.out.println(Arrays.toString((Object[]) result));
            } else {
                System.out.println("Unsupported array type");
            }
        } else {
            System.out.println(result);
        }
    }
}

${code}
`;
      }

      fs.writeFileSync(tempFilePath, wrappedCode);

      const tempDirDocker = path.posix.join(tempContainerDir, tempFileName);
      if (language === 'python') {
        runCommand = `docker exec ${CONTAINER_NAME} python ${tempDirDocker}`;
      } else if (language === 'javascript') {
        runCommand = `docker exec ${CONTAINER_NAME} node ${tempDirDocker}`;
      } else if (language === 'java') {
        runCommand = `docker exec ${CONTAINER_NAME} bash -c "javac ${tempDirDocker} && java -cp /code-tmp code"`;
      }

      const output = await new Promise((resolve, reject) => {
        exec(runCommand, { timeout: 10000 }, (error, stdout, stderr) => {
          if (error) reject(stderr || error.message);
          else resolve(stdout.trim());
        });
      });

      if (fs.existsSync(tempFilePath)) fs.unlinkSync(tempFilePath);

      const normalize = str => (str ?? '').replace(/\s+/g, '').replace(/(\r\n|\n|\r)/gm, '');
      const passed = normalize(output) === normalize(expectedOutput);

      results.push({
        input,
        expectedOutput,
        yourOutput: output,
        passed,
        status: passed ? 'Passed' : 'Failed',
      });
    }

    res.status(200).json({ results });
  } catch (error) {
    res.status(500).json({
      error: 'Code execution failed.',
      details: {
        message: error.toString(),
        dockerCommand: runCommand,
      },
    });
  }
});

module.exports = router;