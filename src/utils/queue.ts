export default class Queue<T> {
	private _queue: T[] = [];

	public get length(): number {
		return this._queue.length;
	}

	public async enqueue(entry: T): Promise<void> {
		this._queue.push(entry);
	}

	public dequeue(index?: number): T | undefined {
		if (index) {
			return this._queue.splice(index, 1)[0];
		}
		return this._queue.shift();
	}

	public peek(): T | undefined {
		return this._queue[0];
	}

	public peekIndex(index: number): T | undefined {
		return this._queue[index];
	}

	public peekTo(index: number): T[] | undefined {
		return this._queue.slice(-index);
	}

	public clear(): void {
		this._queue = [];
	}
}
