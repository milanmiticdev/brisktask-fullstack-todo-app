// Types
import type { DateTime, DateObj, TimeObj } from './../types/util.types';

const UTCtoLocal = (utcTime: string): DateTime => {
	const local: Date = new Date(utcTime);

	const dateObj: DateObj = {
		day: new Date(local).getDate(),
		month: new Date(local).getMonth(),
		year: new Date(local).getFullYear(),
	};

	const timeObj: TimeObj = {
		hours: new Date(local).getHours(),
		minutes: new Date(local).getMinutes(),
		seconds: new Date(local).getSeconds(),
	};

	const formatedDate: string = `${dateObj.day < 10 ? '0' + String(dateObj.day) : dateObj.day}.${
		dateObj.month < 9 ? '0' + String(dateObj.month + 1) : dateObj.month + 1
	}.${dateObj.year}`;

	const formatedTime: string = `${timeObj.hours < 10 ? '0' + String(timeObj.hours) : timeObj.hours}:${
		timeObj.minutes < 10 ? '0' + String(timeObj.minutes) : timeObj.minutes
	}:${timeObj.seconds < 10 ? '0' + String(timeObj.seconds) : timeObj.seconds}`;

	return {
		date: formatedDate,
		time: formatedTime,
	};
};

export default UTCtoLocal;
