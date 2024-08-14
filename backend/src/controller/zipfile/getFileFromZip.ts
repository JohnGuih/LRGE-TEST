import { Request, Response } from 'express';
import { spawn } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as xml2js from 'xml2js';

export async function getFileFromZip(req: Request, res: Response) {
  const filePath = req.params.filePath.replace("%2F", '/');
  const pythonScriptPath = "/home/john/LRGE/hard-skill-test/scrypts/getZip.py";
  // const salt = crypto.randomUUID();
  const tempFolderPath = path.join(__dirname, '../../../public/temp');
  const zipFilePath = path.join(__dirname, './_data/IPhone11Pro.zip');

  // Create the temp folder if it doesn't exist
  if (!fs.existsSync(tempFolderPath)) {
    fs.mkdirSync(tempFolderPath);
  }

  console.log(`File name: ${filePath}`);

  const pythonProcess = spawn('python3', [pythonScriptPath, tempFolderPath, zipFilePath]);

  pythonProcess.stdout.on('data', (data) => {
    console.log(`Received data from Python script: ${data}`);
  });

  pythonProcess.stderr.on('data', (data) => {
    console.error(`Error from Python script: ${data}`);
    res.status(500).send({ message: 'Error reading zip file' });
  });

  pythonProcess.on('close', (code) => {
    if (code === 0) {
      const xmlFilePath = path.join(tempFolderPath, filePath);

      console.log(`XML file path: ${xmlFilePath}`);

      fs.readFile(xmlFilePath, (err, data) => {
        if (err) {
          console.error(`Error reading XML file: ${err}`);
          res.status(500).send({ message: 'Error reading XML file' });
          return;
        }

        const parser = new xml2js.Parser();
        parser.parseString(data, (err, result) => {
          if (err) {
            console.error(`Error parsing XML: ${err}`);
            res.status(500).send({ message: 'Error parsing XML' });
            return;
          }

          const xmlSection = result.project.metadata.find((item: any) => item.$.section === "Device Info")?.item

          // fs.rmSync(tempFolderPath, { recursive: true });
          res.json(xmlSection);
        });
      });
    } else {
      res.status(500).send({ message: 'Error reading zip file' });
      // fs.rmSync(tempFolderPath, { recursive: true });
    }
  });
}