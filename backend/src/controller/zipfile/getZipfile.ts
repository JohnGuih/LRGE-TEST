import { Request, Response } from 'express';
import { spawn } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

export async function getZipfile(req: Request, res: Response) {
  const pythonScriptPath = "/home/john/LRGE/hard-skill-test/scrypts/getZip.py";
  // const salt = crypto.randomUUID();
  const tempFolderPath = path.join(__dirname, '../../../public/temp');
  const zipFilePath = path.join(__dirname, './_data/IPhone11Pro.zip');

  // Create the temp folder if it doesn't exist
  if (!fs.existsSync(tempFolderPath)) {
    fs.mkdirSync(tempFolderPath);
  }

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
      const folderContent = fs.readdirSync(tempFolderPath, { withFileTypes: true }).reduce((acc: any, item: any) => {
        if (item.isDirectory()) {
          acc[item.name] = getFolderContent(path.join(tempFolderPath, item.name));
        } else {
          acc[item.name] = null;
        }
        return acc;
      }, {});
      // fs.rmSync(tempFolderPath, { recursive: true });
      res.json(folderContent);
    } else {
      res.status(500).send({ message: 'Error reading zip file' });
      // fs.rmSync(tempFolderPath, { recursive: true });
    }
  });
}



function getFolderContent(folderPath: any) {
  return fs.readdirSync(folderPath, { withFileTypes: true }).reduce((acc: any, item: any) => {
    if (item.isDirectory()) {
      acc[item.name] = getFolderContent(path.join(folderPath, item.name));
    } else {
      acc[item.name] = null;
    }
    return acc;
  }, {});
}