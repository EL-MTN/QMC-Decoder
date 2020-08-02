'use strict';

function getSeed() {
	let x = -1;
	let y = 8;
	let deltaX = 1;
	let index = -1;

	const seedMap = [
		[0x4a, 0xd6, 0xca, 0x90, 0x67, 0xf7, 0x52],
		[0x5e, 0x95, 0x23, 0x9f, 0x13, 0x11, 0x7e],
		[0x47, 0x74, 0x3d, 0x90, 0xaa, 0x3f, 0x51],
		[0xc6, 0x09, 0xd5, 0x9f, 0xfa, 0x66, 0xf9],
		[0xf3, 0xd6, 0xa1, 0x90, 0xa0, 0xf7, 0xf0],
		[0x1d, 0x95, 0xde, 0x9f, 0x84, 0x11, 0xf4],
		[0x0e, 0x74, 0xbb, 0x90, 0xbc, 0x3f, 0x92],
		[0x00, 0x09, 0x5b, 0x9f, 0x62, 0x66, 0xa1],
	];

	return function next() {
		let value;
		index++;
		if (x < 0) {
			deltaX = 1;
			y = (8 - y) % 8;
			value = 0xc3;
		} else if (x > 6) {
			deltaX = -1;
			y = 7 - y;
			value = 0xd8;
		} else {
			value = seedMap[y] && seedMap[y][x];
		}
		x += deltaX;
		if (index === 0x8000 || (index > 0x8000 && (index + 1) % 0x8000 === 0)) {
			return next();
		}
		return value;
	};
}

function decodeBuffer(fileBuffer) {
	let buffer = fileBuffer;
	const byteLength = buffer.byteLength;

	const seed = getSeed();

	for (let index = 0; index < byteLength; index++) {
		const sourceByte = buffer.readUInt8(index);

		// Changing the source byte and re-saving it
		const distByte = sourceByte ^ seed();
		buffer.writeUInt8(distByte, index);
	}

	return buffer;
}

module.exports = { decodeBuffer };
