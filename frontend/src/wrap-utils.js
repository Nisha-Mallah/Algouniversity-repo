export function wrapUserLogic(language, logic, argNames = []) {
  const joinedArgs = argNames.join(', ');

  if (language === 'python') {
    // Simply wrap the code without changing indentation
    return `def main(${joinedArgs}):\n${logic}`;
  }

  if (language === 'javascript') {
    // Wrap JavaScript code
    return `function main(${joinedArgs}) {\n${logic}\n}`;
  }

  if (language === 'java') {
    // Wrap Java code
    const paramList = argNames.map(() => 'Object').join(', ');
    return `class Solution {\n    public static Object main(${paramList}) {\n${logic}\n    }\n}`;
  }

  // For unsupported or raw languages
  return logic;
}
