const UTCtoLocal = utcTime => {
	const local = new Date(utcTime);

	const dateObj = {
		day: new Date(local).getDate(),
		month: new Date(local).getMonth(),
		year: new Date(local).getFullYear(),
	};

	const timeObj = {
		hours: new Date(local).getHours(),
		minutes: new Date(local).getMinutes(),
		seconds: new Date(local).getSeconds(),
	};

	const formatedDate = `${dateObj.day < 10 ? '0' + String(dateObj.day) : dateObj.day}.${
		dateObj.month < 9 ? '0' + String(dateObj.month + 1) : dateObj.month + 1
	}.${dateObj.year}`;

	const formatedTime = `${timeObj.hours < 10 ? '0' + String(timeObj.hours) : timeObj.hours}:${
		timeObj.minutes < 10 ? '0' + String(timeObj.minutes) : timeObj.minutes
	}:${timeObj.seconds < 10 ? '0' + String(timeObj.seconds) : timeObj.seconds}`;

	return {
		date: formatedDate,
		time: formatedTime,
	};
};

export default UTCtoLocal;
