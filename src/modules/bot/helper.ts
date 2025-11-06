import { Command } from "./command";

export function getExampleMessage(
    command: Command["command"],
    example: Command["example"],
    description: Command["description"]
) {
    let msg = `<b>/${command}</b> - ${description ?? "?"}\n`;

    if (example) {
        if (Array.isArray(example)) {
            msg += `Примеры:\n`;

            example.forEach((_example) => {
                if (typeof _example === "string") {
                    msg += `<code>/${command} ${_example}</code>\n`;
                } else {
                    msg += `<code>/${command} ${_example[0]}</code> - ${_example[1]}\n`;
                }
            });
        } else {
            msg += `Пример: <code>/${command} ${example}</code>\n`;
        }
    }

    msg += "\n";

    return msg;
}
