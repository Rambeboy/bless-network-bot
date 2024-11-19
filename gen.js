const crypto = require('crypto');

const fs = require('fs');

const readline = require('readline');



function getRandomHardwareIdentifier() {

    const randomCpuArchitecture = Math.random() > 0.5 ? 'x64' : 'x86';

    const randomCpuModel = `Fake CPU Model ${Math.floor(Math.random() * 1000)}`;

    const randomNumOfProcessors = Math.floor(Math.random() * 8) + 1;

    const randomTotalMemory = Math.floor(Math.random() * 16 + 1) * 1024 * 1024 * 1024;



    const cpuInfo = {

        cpuArchitecture: randomCpuArchitecture,

        cpuModel: randomCpuModel,

        numOfProcessors: randomNumOfProcessors,

        totalMemory: randomTotalMemory

    };



    return Buffer.from(JSON.stringify(cpuInfo)).toString('base64');

}



function getHardwareIdentifierFromNodeId(nodeId) {

    const cpuArchitecture = 'x64';

    const cpuModel = `Custom CPU Model from Node ID ${nodeId}`;

    const numOfProcessors = 4;

    const totalMemory = 8 * 1024 * 1024 * 1024;



    const cpuInfo = {

        cpuArchitecture: cpuArchitecture,

        cpuModel: cpuModel,

        numOfProcessors: numOfProcessors,

        totalMemory: totalMemory

    };



    return Buffer.from(JSON.stringify(cpuInfo)).toString('base64');

}



async function generateDeviceIdentifier(hardwareIdentifier) {

    const deviceInfo = JSON.stringify({ hardware: hardwareIdentifier });

    const hash = crypto.createHash('sha256');

    hash.update(deviceInfo);

    return hash.digest('hex');

}



function generatePubKey(length = 52) {

    const prefix = "12D3KooW";

    const remainingLength = length - prefix.length;

    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

    let remainingChars = '';



    for (let i = 0; i < remainingLength; i++) {

        const randomIndex = Math.floor(Math.random() * characters.length);

        remainingChars += characters[randomIndex];

    }



    return prefix + remainingChars;

}



const rl = readline.createInterface({

    input: process.stdin,

    output: process.stdout

});



async function main() {

    const chalk = (await import('chalk')).default;



    console.log(chalk.red.bold('This is only for testing purposes, I do not recommend using it'));



    rl.question(chalk.cyan('Which mode do you want to use? (1 = Random, 2 = Custom Node ID): '), async (mode) => {

        if (mode === '2') {

            rl.question(chalk.cyan('Enter your custom Node ID: '), async (nodeId) => {

                const hardwareIdentifier = getHardwareIdentifierFromNodeId(nodeId);

                const deviceIdentifier = await generateDeviceIdentifier(hardwareIdentifier);

                const publicKey = generatePubKey();



                const logEntry = `Device Identifier: ${chalk.green(deviceIdentifier)}\nPublic Key: ${chalk.yellow(publicKey)}\nNode ID: ${chalk.blue(nodeId)}\n`;

                const formattedEntry = `${nodeId}:${deviceIdentifier}\n`;

                console.log(logEntry);

                

                fs.writeFileSync('output_2.txt', formattedEntry);

                console.log(chalk.yellow('Data saved to output_2.txt'));



                rl.close();

            });

        } else {

            rl.question(chalk.cyan('How many identifiers do you want to generate? '), async (answer) => {

                const total = parseInt(answer);

                let output = '';



                for (let i = 0; i < total; i++) {

                    const nodeId = generatePubKey();

                    const hardwareIdentifier = getHardwareIdentifierFromNodeId(nodeId);

                    const deviceIdentifier = await generateDeviceIdentifier(hardwareIdentifier);



                    const logEntry = `Device Identifier ${i + 1}: ${chalk.green(deviceIdentifier)}\nPublic Key ${i + 1}: ${chalk.blue(nodeId)}\n`;

                    const formattedEntry = `${nodeId}:${deviceIdentifier}\n`;

                    output += formattedEntry;

                    console.log(logEntry);

                }



                fs.writeFileSync('output_1.txt', output);

                console.log(chalk.yellow('Data saved to output_1.txt'));



                rl.close();

            });

        }

    });

}



main();
