/**
 * Process array items using promises successively
 *
 * @param array The array to be processed
 * @param callback A callback which will be executed for each item of the array and returns a promise
 * @returns A resolved promise. The result of the promises can be accessed using the resolution callback of the promise (attached by the then function).
 */
export const processArrayUsingPromisesSuccessively = async <T>(array: T[], callback: (item: T) => Promise<any>): Promise<any> => {
    const results: any[] = [];

    return array.reduce<Promise<any>>(async (previousValue, currentValue: T) => {
        return previousValue.then(async () => {
            const promise = callback(currentValue);
            if (promise) {
                return promise.then((data) => {
                    results.push(data);
                    return results;
                });
            }
            return results;
        });
    }, Promise.resolve());
};
