'use strict';
var __awaiter =
    (this && this.__awaiter) ||
    function(thisArg, _arguments, P, generator) {
        return new (P || (P = Promise))(function(resolve, reject) {
            function fulfilled(value) {
                try {
                    step(generator.next(value));
                } catch (e) {
                    reject(e);
                }
            }
            function rejected(value) {
                try {
                    step(generator['throw'](value));
                } catch (e) {
                    reject(e);
                }
            }
            function step(result) {
                result.done
                    ? resolve(result.value)
                    : new P(function(resolve) {
                          resolve(result.value);
                      }).then(fulfilled, rejected);
            }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
Object.defineProperty(exports, '__esModule', {value: true});
exports.processArrayUsingPromisesSuccessively = (array, callback) =>
    __awaiter(this, void 0, void 0, function*() {
        const results = [];
        return array.reduce(
            (previousValue, currentValue) =>
                __awaiter(this, void 0, void 0, function*() {
                    return previousValue.then(() =>
                        __awaiter(this, void 0, void 0, function*() {
                            const promise = callback(currentValue);
                            if (promise) {
                                return promise.then((data) => {
                                    results.push(data);
                                    return results;
                                });
                            }
                            return results;
                        })
                    );
                }),
            Promise.resolve()
        );
    });
//# sourceMappingURL=process-array-using-promises-successively.js.map
