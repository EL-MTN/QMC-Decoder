#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const { decodeBuffer } = require('./decoder');

const error = (message) => {
	console.log(message);
	process.exit(1);
};

if (process.argv.length !== 4) {
	error('Please provide two arguments only');
}

const origin = process.argv[2];
const outFile = process.argv[3];

fs.stat(origin, (err, fileStat) => {
	if (err) {
		error('The original file does not exist');
	}
	if (!fileStat.isFile()) {
		error('The first argument must give the path of a file, not directory');
	}

	const filename = path.basename(origin);
	const extension = path.extname(filename);

	const fileBuffer = fs.readFileSync(origin);
	const newBuffer = decodeBuffer(fileBuffer);

	switch (extension) {
		case '.qmc3':
		case '.qmc0':
		case '.qmcflac': {
			fs.writeFileSync(outFile, newBuffer);
			break;
		}
		default: {
			error(
				'Invalid file extension, please use only QQ Music formats (.qmcflac, .qmc0, .qmc3)'
			);
		}
	}
});
