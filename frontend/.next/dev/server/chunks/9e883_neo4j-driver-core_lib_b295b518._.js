module.exports = [
"[project]/frontend/node_modules/neo4j-driver-core/lib/internal/object-util.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.createBrokenObject = createBrokenObject;
exports.isBrokenObject = isBrokenObject;
exports.getBrokenObjectReason = getBrokenObjectReason;
/**
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [https://neo4j.com]
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ // eslint-disable-next-line @typescript-eslint/naming-convention
var __isBrokenObject__ = '__isBrokenObject__';
// eslint-disable-next-line @typescript-eslint/naming-convention
var __reason__ = '__reason__';
/**
 * Creates a object which all method call will throw the given error
 *
 * @param {Error} error The error
 * @param {any} object The object. Default: {}
 * @returns {any} A broken object
 */ function createBrokenObject(error, object) {
    if (object === void 0) {
        object = {};
    }
    var fail = function() {
        throw error;
    };
    return new Proxy(object, {
        get: function(_, p) {
            if (p === __isBrokenObject__) {
                return true;
            } else if (p === __reason__) {
                return error;
            } else if (p === 'toJSON') {
                return undefined;
            }
            fail();
        },
        set: fail,
        apply: fail,
        construct: fail,
        defineProperty: fail,
        deleteProperty: fail,
        getOwnPropertyDescriptor: fail,
        getPrototypeOf: fail,
        has: fail,
        isExtensible: fail,
        ownKeys: fail,
        preventExtensions: fail,
        setPrototypeOf: fail
    });
}
/**
 * Verifies if it is a Broken Object
 * @param {any} object The object
 * @returns {boolean} If it was created with createBrokenObject
 */ function isBrokenObject(object) {
    return object !== null && typeof object === 'object' && object[__isBrokenObject__] === true;
}
/**
 * Returns if the reason the object is broken.
 *
 * This method should only be called with instances create with {@link createBrokenObject}
 *
 * @param {any} object The object
 * @returns {Error} The reason the object is broken
 */ function getBrokenObjectReason(object) {
    return object[__reason__];
}
}),
"[project]/frontend/node_modules/neo4j-driver-core/lib/json.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/**
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [https://neo4j.com]
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.stringify = stringify;
var object_util_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/internal/object-util.js [app-route] (ecmascript)");
/**
 * Custom version on JSON.stringify that can handle values that normally don't support serialization, such as BigInt.
 * @private
 * @param val A JavaScript value, usually an object or array, to be converted.
 * @returns A JSON string representing the given value.
 */ function stringify(val, opts) {
    return JSON.stringify(val, function(_, value) {
        if ((0, object_util_1.isBrokenObject)(value)) {
            return {
                __isBrokenObject__: true,
                __reason__: (0, object_util_1.getBrokenObjectReason)(value)
            };
        }
        if (typeof value === 'bigint') {
            return "".concat(value, "n");
        }
        if ((opts === null || opts === void 0 ? void 0 : opts.sortedElements) === true && typeof value === 'object' && !Array.isArray(value)) {
            return Object.keys(value).sort().reduce(function(obj, key) {
                // @ts-expect-error: no way to avoid implicit 'any'
                obj[key] = value[key];
                return obj;
            }, {});
        }
        if ((opts === null || opts === void 0 ? void 0 : opts.useCustomToString) === true && typeof value === 'object' && !Array.isArray(value) && typeof value.toString === 'function' && value.toString !== Object.prototype.toString) {
            return value === null || value === void 0 ? void 0 : value.toString();
        }
        return value;
    });
}
}),
"[project]/frontend/node_modules/neo4j-driver-core/lib/gql-constants.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.rawPolyfilledDiagnosticRecord = void 0;
exports.rawPolyfilledDiagnosticRecord = {
    OPERATION: '',
    OPERATION_CODE: '0',
    CURRENT_SCHEMA: '/'
};
Object.freeze(exports.rawPolyfilledDiagnosticRecord);
}),
"[project]/frontend/node_modules/neo4j-driver-core/lib/error.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/**
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [https://neo4j.com]
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ var __extends = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__extends || function() {
    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || ({
            __proto__: []
        }) instanceof Array && function(d, b) {
            d.__proto__ = b;
        } || function(d, b) {
            for(var p in b)if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
        };
        return extendStatics(d, b);
    };
    return function(d, b) {
        if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
}();
var __createBinding = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__createBinding || (Object.create ? function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = {
            enumerable: true,
            get: function() {
                return m[k];
            }
        };
    }
    Object.defineProperty(o, k2, desc);
} : function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
});
var __setModuleDefault = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__setModuleDefault || (Object.create ? function(o, v) {
    Object.defineProperty(o, "default", {
        enumerable: true,
        value: v
    });
} : function(o, v) {
    o["default"] = v;
});
var __importStar = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__importStar || function() {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function(o) {
            var ar = [];
            for(var k in o)if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function(mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) {
            for(var k = ownKeys(mod), i = 0; i < k.length; i++)if (k[i] !== "default") __createBinding(result, mod, k[i]);
        }
        __setModuleDefault(result, mod);
        return result;
    };
}();
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.PROTOCOL_ERROR = exports.SESSION_EXPIRED = exports.SERVICE_UNAVAILABLE = exports.GQLError = exports.Neo4jError = exports.isRetryableError = exports.isRetriableError = void 0;
exports.newError = newError;
exports.newGQLError = newGQLError;
// A common place for constructing error objects, to keep them
// uniform across the driver surface.
var json = __importStar(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/json.js [app-route] (ecmascript)"));
var gql_constants_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/gql-constants.js [app-route] (ecmascript)");
/**
 * @typedef { 'DATABASE_ERROR' | 'CLIENT_ERROR' | 'TRANSIENT_ERROR' | 'UNKNOWN' } ErrorClassification
 */ var errorClassification = {
    DATABASE_ERROR: 'DATABASE_ERROR',
    CLIENT_ERROR: 'CLIENT_ERROR',
    TRANSIENT_ERROR: 'TRANSIENT_ERROR',
    UNKNOWN: 'UNKNOWN'
};
Object.freeze(errorClassification);
var classifications = Object.values(errorClassification);
/**
 * Error code representing complete loss of service. Used by {@link Neo4jError#code}.
 * @type {string}
 */ var SERVICE_UNAVAILABLE = 'ServiceUnavailable';
exports.SERVICE_UNAVAILABLE = SERVICE_UNAVAILABLE;
/**
 * Error code representing transient loss of service. Used by {@link Neo4jError#code}.
 * @type {string}
 */ var SESSION_EXPIRED = 'SessionExpired';
exports.SESSION_EXPIRED = SESSION_EXPIRED;
/**
 * Error code representing serialization/deserialization issue in the Bolt protocol. Used by {@link Neo4jError#code}.
 * @type {string}
 */ var PROTOCOL_ERROR = 'ProtocolError';
exports.PROTOCOL_ERROR = PROTOCOL_ERROR;
/**
 * Error code representing an no classified error. Used by {@link Neo4jError#code}.
 * @type {string}
 */ var NOT_AVAILABLE = 'N/A';
/// TODO: Remove definitions of this.constructor and this.__proto__
/**
 * Class for nested errors, to be used as causes in {@link Neo4jError}
 */ var GQLError = function(_super) {
    __extends(GQLError, _super);
    /**
     * @constructor
     * @param {string} message - the error message
     * @param {string} gqlStatus - the GQL status code of the error
     * @param {string} gqlStatusDescription - the GQL status description of the error
     * @param {ErrorDiagnosticRecord} diagnosticRecord - the error diagnostic record
     * @param {Error} cause - Optional nested error, the cause of the error
     */ function GQLError(message, gqlStatus, gqlStatusDescription, diagnosticRecord, cause) {
        var _a;
        // eslint-disable-next-line
        // @ts-ignore: not available in ES6 yet
        var _this = _super.call(this, message, cause != null ? {
            cause: cause
        } : undefined) || this;
        _this.constructor = GQLError;
        // eslint-disable-next-line no-proto
        _this.__proto__ = GQLError.prototype;
        /**
         * Optional, nested error which caused the error
         *
         * @type {Error?}
         * @public
         */ _this.cause = cause != null ? cause : undefined;
        /**
         * The GQL Status code
         *
         * @type {string}
         * @public
         */ _this.gqlStatus = gqlStatus;
        /**
         * The GQL Status Description
         *
         * @type {string}
         * @public
         */ _this.gqlStatusDescription = gqlStatusDescription;
        /**
         * The GQL diagnostic record
         *
         * @type {DiagnosticRecord}
         * @public
         */ _this.diagnosticRecord = diagnosticRecord;
        /**
         * The GQL error classification, extracted from the diagnostic record
         *
         * @type {ErrorClassification}
         * @public
         */ _this.classification = _extractClassification(_this.diagnosticRecord);
        /**
         * The GQL error classification, extracted from the diagnostic record as a raw string
         *
         * @type {string}
         * @public
         */ _this.rawClassification = (_a = diagnosticRecord === null || diagnosticRecord === void 0 ? void 0 : diagnosticRecord._classification) !== null && _a !== void 0 ? _a : undefined;
        /**
         * Represents the name for the type of error, inherited from base JavaScript {@link Error}.
         * Will be 'GQLError' for {@link GQLError}s and 'Neo4jError' for {@link Neo4jError}s.
         *
         * @type {string}
         * @public
         */ _this.name = 'GQLError';
        return _this;
    }
    /**
     * Returns whether a given GqlStatus code can be found in the cause chain of the error (including the error itself).
     *
     * @param {string} gqlStatus the GqlStatus code to find
     * @returns {boolean}
     */ GQLError.prototype.containsGqlCause = function(gqlStatus) {
        return this.findByGqlStatus(gqlStatus) !== undefined;
    };
    /**
     * Returns the first error in the cause chain (including the error itself) with a given GqlStatus code.
     * Returns undefined if the GqlStatus code is not present anywhere in the chain.
     *
     * @param {string} gqlStatus the GqlStatus code to find
     * @returns {GQLError | Neo4jError | undefined}
     */ GQLError.prototype.findByGqlStatus = function(gqlStatus) {
        if (this.gqlStatus === gqlStatus) {
            return this;
        }
        if (this.cause !== undefined && (this.cause instanceof GQLError || this.cause instanceof Neo4jError)) {
            return this.cause.findByGqlStatus(gqlStatus);
        }
        return undefined;
    };
    Object.defineProperty(GQLError.prototype, "diagnosticRecordAsJsonString", {
        /**
         * The json string representation of the diagnostic record.
         * The goal of this method is provide a serialized object for human inspection.
         *
         * @type {string}
         * @public
         */ get: function() {
            return json.stringify(this.diagnosticRecord, {
                useCustomToString: true
            });
        },
        enumerable: false,
        configurable: true
    });
    return GQLError;
}(Error);
exports.GQLError = GQLError;
/**
 * Class for all errors thrown/returned by the driver.
 */ var Neo4jError = function(_super) {
    __extends(Neo4jError, _super);
    /**
     * @constructor
     * @param {string} message - the error message
     * @param {string} code - Optional error code. Will be populated when error originates in the database.
     * @param {string} gqlStatus - the GQL status code of the error
     * @param {string} gqlStatusDescription - the GQL status description of the error
     * @param {DiagnosticRecord} diagnosticRecord - the error diagnostic record
     * @param {Error} cause - Optional nested error, the cause of the error
     */ function Neo4jError(message, code, gqlStatus, gqlStatusDescription, diagnosticRecord, cause) {
        var _this = _super.call(this, message, gqlStatus, gqlStatusDescription, diagnosticRecord, cause) || this;
        _this.constructor = Neo4jError;
        // eslint-disable-next-line no-proto
        _this.__proto__ = Neo4jError.prototype;
        /**
         * The Neo4j Error code
         *
         * @type {string}
         * @public
         */ _this.code = code;
        /**
         * The name of the type of error.
         *
         * @type {string}
         * @public
         */ _this.name = 'Neo4jError';
        var isRetryableCode = _isRetryableCode(code);
        /**
         * If the error is considered retriable.
         * This does not apply when running auto-commit transactions using {@link Session#run}
         *
         * @deprecated members using the spelling 'retriable' will be removed in 7.0. Use {@link retryable} instead.
         * @type {boolean}
         * @public
         */ _this.retriable = isRetryableCode;
        /**
         * If the error is considered retryable.
         * This does not apply when running auto-commit transactions using {@link Session#run}
         *
         * @type {boolean}
         * @public
         */ _this.retryable = isRetryableCode;
        return _this;
    }
    /**
     * Verifies if the given error is retriable.
     *
     * @deprecated members using the spelling 'retriable' will be removed in 7.0. Use {@link isRetryable} instead.
     * @param {object|undefined|null} error the error object
     * @returns {boolean} true if the error is retriable
     */ Neo4jError.isRetriable = function(error) {
        return this.isRetryable(error);
    };
    /**
     * Verifies if the given error is retryable.
     *
     * @param {object|undefined|null} error the error object
     * @returns {boolean} true if the error is retryable
     */ Neo4jError.isRetryable = function(error) {
        return error !== null && error !== undefined && error instanceof Neo4jError && error.retryable;
    };
    return Neo4jError;
}(GQLError);
exports.Neo4jError = Neo4jError;
/**
 * Create a new error from a message and optional data
 * @param message the error message
 * @param {Neo4jErrorCode} [code] the error code
 * @param {Neo4jError} [cause]
 * @param {String} [gqlStatus]
 * @param {String} [gqlStatusDescription]
 * @param {DiagnosticRecord} diagnosticRecord - the error message
 * @return {Neo4jError} an {@link Neo4jError}
 * @private
 */ function newError(message, code, cause, gqlStatus, gqlStatusDescription, diagnosticRecord) {
    return new Neo4jError(message, code !== null && code !== void 0 ? code : NOT_AVAILABLE, gqlStatus !== null && gqlStatus !== void 0 ? gqlStatus : '50N42', gqlStatusDescription !== null && gqlStatusDescription !== void 0 ? gqlStatusDescription : 'error: general processing exception - unexpected error. ' + message, diagnosticRecord !== null && diagnosticRecord !== void 0 ? diagnosticRecord : gql_constants_1.rawPolyfilledDiagnosticRecord, cause);
}
/**
 * Create a new GQL error from a message and optional data
 * @param message the error message
 * @param {Neo4jError} [cause]
 * @param {String} [gqlStatus]
 * @param {String} [gqlStatusDescription]
 * @param {DiagnosticRecord} diagnosticRecord - the error message
 * @return {Neo4jError} an {@link Neo4jError}
 * @private
 */ function newGQLError(message, cause, gqlStatus, gqlStatusDescription, diagnosticRecord) {
    return new GQLError(message, gqlStatus !== null && gqlStatus !== void 0 ? gqlStatus : '50N42', gqlStatusDescription !== null && gqlStatusDescription !== void 0 ? gqlStatusDescription : 'error: general processing exception - unexpected error. ' + message, diagnosticRecord !== null && diagnosticRecord !== void 0 ? diagnosticRecord : gql_constants_1.rawPolyfilledDiagnosticRecord, cause);
}
/**
 * Verifies if the given error is retriable.
 *
 * @deprecated members using the spelling 'retriable' will be removed in 7.0. Use {@link isRetryableError} instead.
 * @public
 * @param {object|undefined|null} error the error object
 * @returns {boolean} true if the error is retriable
 */ var isRetriableError = Neo4jError.isRetriable;
exports.isRetriableError = isRetriableError;
/**
 * Verifies if the given error is retryable.
 *
 * @public
 * @param {object|undefined|null} error the error object
 * @returns {boolean} true if the error is retryable
 */ var isRetryableError = Neo4jError.isRetryable;
exports.isRetryableError = isRetryableError;
/**
 * @private
 * @param {string} code the error code
 * @returns {boolean} true if the error is a retriable error
 */ function _isRetryableCode(code) {
    return code === SERVICE_UNAVAILABLE || code === SESSION_EXPIRED || _isAuthorizationExpired(code) || _isTransientError(code);
}
/**
 * @private
 * @param {string} code the error to check
 * @return {boolean} true if the error is a transient error
 */ function _isTransientError(code) {
    return (code === null || code === void 0 ? void 0 : code.includes('TransientError')) === true;
}
/**
 * @private
 * @param {string} code the error to check
 * @returns {boolean} true if the error is a service unavailable error
 */ function _isAuthorizationExpired(code) {
    return code === 'Neo.ClientError.Security.AuthorizationExpired';
}
/**
 * extracts a typed classification from the diagnostic record.
 */ function _extractClassification(diagnosticRecord) {
    if (diagnosticRecord === undefined || diagnosticRecord._classification === undefined) {
        return 'UNKNOWN';
    }
    return classifications.includes(diagnosticRecord._classification) ? diagnosticRecord === null || diagnosticRecord === void 0 ? void 0 : diagnosticRecord._classification : 'UNKNOWN';
}
}),
"[project]/frontend/node_modules/neo4j-driver-core/lib/integer.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/**
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [https://neo4j.com]
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.toString = exports.toNumber = exports.inSafeRange = exports.isInt = exports.int = void 0;
// 64-bit Integer library, originally from Long.js by dcodeIO
// https://github.com/dcodeIO/Long.js
// License Apache 2
var error_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/error.js [app-route] (ecmascript)");
/**
 * A cache of the Integer representations of small integer values.
 * @type {!Object}
 * @inner
 * @private
 */ // eslint-disable-next-line no-use-before-define
var INT_CACHE = new Map();
/**
 * Constructs a 64 bit two's-complement integer, given its low and high 32 bit values as *signed* integers.
 * See exported functions for more convenient ways of operating integers.
 * Use `int()` function to create new integers, `isInt()` to check if given object is integer,
 * `inSafeRange()` to check if it is safe to convert given value to native number,
 * `toNumber()` and `toString()` to convert given integer to number or string respectively.
 * @access public
 * @exports Integer
 * @class A Integer class for representing a 64 bit two's-complement integer value.
 * @param {number} low The low (signed) 32 bits of the long
 * @param {number} high The high (signed) 32 bits of the long
 *
 * @constructor
 */ var Integer = function() {
    function Integer(low, high) {
        /**
         * The low 32 bits as a signed value.
         * @type {number}
         * @expose
         */ this.low = low !== null && low !== void 0 ? low : 0;
        /**
         * The high 32 bits as a signed value.
         * @type {number}
         * @expose
         */ this.high = high !== null && high !== void 0 ? high : 0;
    }
    // The internal representation of an Integer is the two given signed, 32-bit values.
    // We use 32-bit pieces because these are the size of integers on which
    // JavaScript performs bit-operations.  For operations like addition and
    // multiplication, we split each number into 16 bit pieces, which can easily be
    // multiplied within JavaScript's floating-point representation without overflow
    // or change in sign.
    //
    // In the algorithms below, we frequently reduce the negative case to the
    // positive case by negating the input(s) and then post-processing the result.
    // Note that we must ALWAYS check specially whether those values are MIN_VALUE
    // (-2^63) because -MIN_VALUE == MIN_VALUE (since 2^63 cannot be represented as
    // a positive number, it overflows back into a negative).  Not handling this
    // case would often result in infinite recursion.
    //
    // Common constant values ZERO, ONE, NEG_ONE, etc. are defined below the from*
    // methods on which they depend.
    Integer.prototype.inSafeRange = function() {
        return this.greaterThanOrEqual(Integer.MIN_SAFE_VALUE) && this.lessThanOrEqual(Integer.MAX_SAFE_VALUE);
    };
    /**
     * Converts the Integer to an exact javascript Number, assuming it is a 32 bit integer.
     * @returns {number}
     * @expose
     */ Integer.prototype.toInt = function() {
        return this.low;
    };
    /**
     * Converts the Integer to a the nearest floating-point representation of this value (double, 53 bit mantissa).
     * @returns {number}
     * @expose
     */ Integer.prototype.toNumber = function() {
        return this.high * TWO_PWR_32_DBL + (this.low >>> 0);
    };
    /**
     * Converts the Integer to a BigInt representation of this value
     * @returns {bigint}
     * @expose
     */ Integer.prototype.toBigInt = function() {
        if (this.isZero()) {
            return BigInt(0);
        } else if (this.isPositive()) {
            return BigInt(this.high >>> 0) * BigInt(TWO_PWR_32_DBL) + BigInt(this.low >>> 0);
        } else {
            var negate = this.negate();
            return BigInt(-1) * (BigInt(negate.high >>> 0) * BigInt(TWO_PWR_32_DBL) + BigInt(negate.low >>> 0));
        }
    };
    /**
     * Converts the Integer to native number or -Infinity/+Infinity when it does not fit.
     * @return {number}
     * @package
     */ Integer.prototype.toNumberOrInfinity = function() {
        if (this.lessThan(Integer.MIN_SAFE_VALUE)) {
            return Number.NEGATIVE_INFINITY;
        } else if (this.greaterThan(Integer.MAX_SAFE_VALUE)) {
            return Number.POSITIVE_INFINITY;
        } else {
            return this.toNumber();
        }
    };
    /**
     * Converts the Integer to a string written in the specified radix.
     * @param {number=} radix Radix (2-36), defaults to 10
     * @returns {string}
     * @override
     * @throws {RangeError} If `radix` is out of range
     * @expose
     */ Integer.prototype.toString = function(radix) {
        radix = radix !== null && radix !== void 0 ? radix : 10;
        if (radix < 2 || radix > 36) {
            throw RangeError('radix out of range: ' + radix.toString());
        }
        if (this.isZero()) {
            return '0';
        }
        var rem;
        if (this.isNegative()) {
            if (this.equals(Integer.MIN_VALUE)) {
                // We need to change the Integer value before it can be negated, so we remove
                // the bottom-most digit in this base and then recurse to do the rest.
                var radixInteger = Integer.fromNumber(radix);
                var div = this.div(radixInteger);
                rem = div.multiply(radixInteger).subtract(this);
                return div.toString(radix) + rem.toInt().toString(radix);
            } else {
                return '-' + this.negate().toString(radix);
            }
        }
        // Do several (6) digits each time through the loop, so as to
        // minimize the calls to the very expensive emulated div.
        var radixToPower = Integer.fromNumber(Math.pow(radix, 6));
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        rem = this;
        var result = '';
        while(true){
            var remDiv = rem.div(radixToPower);
            var intval = rem.subtract(remDiv.multiply(radixToPower)).toInt() >>> 0;
            var digits = intval.toString(radix);
            rem = remDiv;
            if (rem.isZero()) {
                return digits + result;
            } else {
                while(digits.length < 6){
                    digits = '0' + digits;
                }
                result = '' + digits + result;
            }
        }
    };
    /**
     * Converts the Integer to it primitive value.
     *
     * @since 5.4.0
     * @returns {bigint}
     *
     * @see {@link Integer#toBigInt}
     * @see {@link Integer#toInt}
     * @see {@link Integer#toNumber}
     * @see {@link Integer#toString}
     */ Integer.prototype.valueOf = function() {
        return this.toBigInt();
    };
    /**
     * Gets the high 32 bits as a signed integer.
     * @returns {number} Signed high bits
     * @expose
     */ Integer.prototype.getHighBits = function() {
        return this.high;
    };
    /**
     * Gets the low 32 bits as a signed integer.
     * @returns {number} Signed low bits
     * @expose
     */ Integer.prototype.getLowBits = function() {
        return this.low;
    };
    /**
     * Gets the number of bits needed to represent the absolute value of this Integer.
     * @returns {number}
     * @expose
     */ Integer.prototype.getNumBitsAbs = function() {
        if (this.isNegative()) {
            return this.equals(Integer.MIN_VALUE) ? 64 : this.negate().getNumBitsAbs();
        }
        var val = this.high !== 0 ? this.high : this.low;
        var bit = 0;
        for(bit = 31; bit > 0; bit--){
            if ((val & 1 << bit) !== 0) {
                break;
            }
        }
        return this.high !== 0 ? bit + 33 : bit + 1;
    };
    /**
     * Tests if this Integer's value equals zero.
     * @returns {boolean}
     * @expose
     */ Integer.prototype.isZero = function() {
        return this.high === 0 && this.low === 0;
    };
    /**
     * Tests if this Integer's value is negative.
     * @returns {boolean}
     * @expose
     */ Integer.prototype.isNegative = function() {
        return this.high < 0;
    };
    /**
     * Tests if this Integer's value is positive.
     * @returns {boolean}
     * @expose
     */ Integer.prototype.isPositive = function() {
        return this.high >= 0;
    };
    /**
     * Tests if this Integer's value is odd.
     * @returns {boolean}
     * @expose
     */ Integer.prototype.isOdd = function() {
        return (this.low & 1) === 1;
    };
    /**
     * Tests if this Integer's value is even.
     * @returns {boolean}
     * @expose
     */ Integer.prototype.isEven = function() {
        return (this.low & 1) === 0;
    };
    /**
     * Tests if this Integer's value equals the specified's.
     * @param {!Integer|number|string} other Other value
     * @returns {boolean}
     * @expose
     */ Integer.prototype.equals = function(other) {
        var theOther = Integer.fromValue(other);
        return this.high === theOther.high && this.low === theOther.low;
    };
    /**
     * Tests if this Integer's value differs from the specified's.
     * @param {!Integer|number|string} other Other value
     * @returns {boolean}
     * @expose
     */ Integer.prototype.notEquals = function(other) {
        return !this.equals(/* validates */ other);
    };
    /**
     * Tests if this Integer's value is less than the specified's.
     * @param {!Integer|number|string} other Other value
     * @returns {boolean}
     * @expose
     */ Integer.prototype.lessThan = function(other) {
        return this.compare(/* validates */ other) < 0;
    };
    /**
     * Tests if this Integer's value is less than or equal the specified's.
     * @param {!Integer|number|string} other Other value
     * @returns {boolean}
     * @expose
     */ Integer.prototype.lessThanOrEqual = function(other) {
        return this.compare(/* validates */ other) <= 0;
    };
    /**
     * Tests if this Integer's value is greater than the specified's.
     * @param {!Integer|number|string} other Other value
     * @returns {boolean}
     * @expose
     */ Integer.prototype.greaterThan = function(other) {
        return this.compare(/* validates */ other) > 0;
    };
    /**
     * Tests if this Integer's value is greater than or equal the specified's.
     * @param {!Integer|number|string} other Other value
     * @returns {boolean}
     * @expose
     */ Integer.prototype.greaterThanOrEqual = function(other) {
        return this.compare(/* validates */ other) >= 0;
    };
    /**
     * Compares this Integer's value with the specified's.
     * @param {!Integer|number|string} other Other value
     * @returns {number} 0 if they are the same, 1 if the this is greater and -1
     *  if the given one is greater
     * @expose
     */ Integer.prototype.compare = function(other) {
        var theOther = Integer.fromValue(other);
        if (this.equals(theOther)) {
            return 0;
        }
        var thisNeg = this.isNegative();
        var otherNeg = theOther.isNegative();
        if (thisNeg && !otherNeg) {
            return -1;
        }
        if (!thisNeg && otherNeg) {
            return 1;
        }
        // At this point the sign bits are the same
        return this.subtract(theOther).isNegative() ? -1 : 1;
    };
    /**
     * Negates this Integer's value.
     * @returns {!Integer} Negated Integer
     * @expose
     */ Integer.prototype.negate = function() {
        if (this.equals(Integer.MIN_VALUE)) {
            return Integer.MIN_VALUE;
        }
        return this.not().add(Integer.ONE);
    };
    /**
     * Returns the sum of this and the specified Integer.
     * @param {!Integer|number|string} addend Addend
     * @returns {!Integer} Sum
     * @expose
     */ Integer.prototype.add = function(addend) {
        var theAddend = Integer.fromValue(addend);
        // Divide each number into 4 chunks of 16 bits, and then sum the chunks.
        var a48 = this.high >>> 16;
        var a32 = this.high & 0xffff;
        var a16 = this.low >>> 16;
        var a00 = this.low & 0xffff;
        var b48 = theAddend.high >>> 16;
        var b32 = theAddend.high & 0xffff;
        var b16 = theAddend.low >>> 16;
        var b00 = theAddend.low & 0xffff;
        var c48 = 0;
        var c32 = 0;
        var c16 = 0;
        var c00 = 0;
        c00 += a00 + b00;
        c16 += c00 >>> 16;
        c00 &= 0xffff;
        c16 += a16 + b16;
        c32 += c16 >>> 16;
        c16 &= 0xffff;
        c32 += a32 + b32;
        c48 += c32 >>> 16;
        c32 &= 0xffff;
        c48 += a48 + b48;
        c48 &= 0xffff;
        return Integer.fromBits(c16 << 16 | c00, c48 << 16 | c32);
    };
    /**
     * Returns the difference of this and the specified Integer.
     * @param {!Integer|number|string} subtrahend Subtrahend
     * @returns {!Integer} Difference
     * @expose
     */ Integer.prototype.subtract = function(subtrahend) {
        var theSubtrahend = Integer.fromValue(subtrahend);
        return this.add(theSubtrahend.negate());
    };
    /**
     * Returns the product of this and the specified Integer.
     * @param {!Integer|number|string} multiplier Multiplier
     * @returns {!Integer} Product
     * @expose
     */ Integer.prototype.multiply = function(multiplier) {
        if (this.isZero()) {
            return Integer.ZERO;
        }
        var theMultiplier = Integer.fromValue(multiplier);
        if (theMultiplier.isZero()) {
            return Integer.ZERO;
        }
        if (this.equals(Integer.MIN_VALUE)) {
            return theMultiplier.isOdd() ? Integer.MIN_VALUE : Integer.ZERO;
        }
        if (theMultiplier.equals(Integer.MIN_VALUE)) {
            return this.isOdd() ? Integer.MIN_VALUE : Integer.ZERO;
        }
        if (this.isNegative()) {
            if (theMultiplier.isNegative()) {
                return this.negate().multiply(theMultiplier.negate());
            } else {
                return this.negate().multiply(theMultiplier).negate();
            }
        } else if (theMultiplier.isNegative()) {
            return this.multiply(theMultiplier.negate()).negate();
        }
        // If both longs are small, use float multiplication
        if (this.lessThan(TWO_PWR_24) && theMultiplier.lessThan(TWO_PWR_24)) {
            return Integer.fromNumber(this.toNumber() * theMultiplier.toNumber());
        }
        // Divide each long into 4 chunks of 16 bits, and then add up 4x4 products.
        // We can skip products that would overflow.
        var a48 = this.high >>> 16;
        var a32 = this.high & 0xffff;
        var a16 = this.low >>> 16;
        var a00 = this.low & 0xffff;
        var b48 = theMultiplier.high >>> 16;
        var b32 = theMultiplier.high & 0xffff;
        var b16 = theMultiplier.low >>> 16;
        var b00 = theMultiplier.low & 0xffff;
        var c48 = 0;
        var c32 = 0;
        var c16 = 0;
        var c00 = 0;
        c00 += a00 * b00;
        c16 += c00 >>> 16;
        c00 &= 0xffff;
        c16 += a16 * b00;
        c32 += c16 >>> 16;
        c16 &= 0xffff;
        c16 += a00 * b16;
        c32 += c16 >>> 16;
        c16 &= 0xffff;
        c32 += a32 * b00;
        c48 += c32 >>> 16;
        c32 &= 0xffff;
        c32 += a16 * b16;
        c48 += c32 >>> 16;
        c32 &= 0xffff;
        c32 += a00 * b32;
        c48 += c32 >>> 16;
        c32 &= 0xffff;
        c48 += a48 * b00 + a32 * b16 + a16 * b32 + a00 * b48;
        c48 &= 0xffff;
        return Integer.fromBits(c16 << 16 | c00, c48 << 16 | c32);
    };
    /**
     * Returns this Integer divided by the specified.
     * @param {!Integer|number|string} divisor Divisor
     * @returns {!Integer} Quotient
     * @expose
     */ Integer.prototype.div = function(divisor) {
        var theDivisor = Integer.fromValue(divisor);
        if (theDivisor.isZero()) {
            throw (0, error_1.newError)('division by zero');
        }
        if (this.isZero()) {
            return Integer.ZERO;
        }
        var approx, rem, res;
        if (this.equals(Integer.MIN_VALUE)) {
            if (theDivisor.equals(Integer.ONE) || theDivisor.equals(Integer.NEG_ONE)) {
                return Integer.MIN_VALUE;
            }
            if (theDivisor.equals(Integer.MIN_VALUE)) {
                return Integer.ONE;
            } else {
                // At this point, we have |other| >= 2, so |this/other| < |MIN_VALUE|.
                var halfThis = this.shiftRight(1);
                approx = halfThis.div(theDivisor).shiftLeft(1);
                if (approx.equals(Integer.ZERO)) {
                    return theDivisor.isNegative() ? Integer.ONE : Integer.NEG_ONE;
                } else {
                    rem = this.subtract(theDivisor.multiply(approx));
                    res = approx.add(rem.div(theDivisor));
                    return res;
                }
            }
        } else if (theDivisor.equals(Integer.MIN_VALUE)) {
            return Integer.ZERO;
        }
        if (this.isNegative()) {
            if (theDivisor.isNegative()) {
                return this.negate().div(theDivisor.negate());
            }
            return this.negate().div(theDivisor).negate();
        } else if (theDivisor.isNegative()) {
            return this.div(theDivisor.negate()).negate();
        }
        // Repeat the following until the remainder is less than other:  find a
        // floating-point that approximates remainder / other *from below*, add this
        // into the result, and subtract it from the remainder.  It is critical that
        // the approximate value is less than or equal to the real value so that the
        // remainder never becomes negative.
        res = Integer.ZERO;
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        rem = this;
        while(rem.greaterThanOrEqual(theDivisor)){
            // Approximate the result of division. This may be a little greater or
            // smaller than the actual value.
            approx = Math.max(1, Math.floor(rem.toNumber() / theDivisor.toNumber()));
            // We will tweak the approximate result by changing it in the 48-th digit or
            // the smallest non-fractional digit, whichever is larger.
            var log2 = Math.ceil(Math.log(approx) / Math.LN2);
            var delta = log2 <= 48 ? 1 : Math.pow(2, log2 - 48);
            // Decrease the approximation until it is smaller than the remainder.  Note
            // that if it is too large, the product overflows and is negative.
            var approxRes = Integer.fromNumber(approx);
            var approxRem = approxRes.multiply(theDivisor);
            while(approxRem.isNegative() || approxRem.greaterThan(rem)){
                approx -= delta;
                approxRes = Integer.fromNumber(approx);
                approxRem = approxRes.multiply(theDivisor);
            }
            // We know the answer can't be zero... and actually, zero would cause
            // infinite recursion since we would make no progress.
            if (approxRes.isZero()) {
                approxRes = Integer.ONE;
            }
            res = res.add(approxRes);
            rem = rem.subtract(approxRem);
        }
        return res;
    };
    /**
     * Returns this Integer modulo the specified.
     * @param {!Integer|number|string} divisor Divisor
     * @returns {!Integer} Remainder
     * @expose
     */ Integer.prototype.modulo = function(divisor) {
        var theDivisor = Integer.fromValue(divisor);
        return this.subtract(this.div(theDivisor).multiply(theDivisor));
    };
    /**
     * Returns the bitwise NOT of this Integer.
     * @returns {!Integer}
     * @expose
     */ Integer.prototype.not = function() {
        return Integer.fromBits(~this.low, ~this.high);
    };
    /**
     * Returns the bitwise AND of this Integer and the specified.
     * @param {!Integer|number|string} other Other Integer
     * @returns {!Integer}
     * @expose
     */ Integer.prototype.and = function(other) {
        var theOther = Integer.fromValue(other);
        return Integer.fromBits(this.low & theOther.low, this.high & theOther.high);
    };
    /**
     * Returns the bitwise OR of this Integer and the specified.
     * @param {!Integer|number|string} other Other Integer
     * @returns {!Integer}
     * @expose
     */ Integer.prototype.or = function(other) {
        var theOther = Integer.fromValue(other);
        return Integer.fromBits(this.low | theOther.low, this.high | theOther.high);
    };
    /**
     * Returns the bitwise XOR of this Integer and the given one.
     * @param {!Integer|number|string} other Other Integer
     * @returns {!Integer}
     * @expose
     */ Integer.prototype.xor = function(other) {
        var theOther = Integer.fromValue(other);
        return Integer.fromBits(this.low ^ theOther.low, this.high ^ theOther.high);
    };
    /**
     * Returns this Integer with bits shifted to the left by the given amount.
     * @param {number|!Integer} numBits Number of bits
     * @returns {!Integer} Shifted Integer
     * @expose
     */ Integer.prototype.shiftLeft = function(numBits) {
        var bitsCount = Integer.toNumber(numBits);
        if ((bitsCount &= 63) === 0) {
            return Integer.ZERO;
        } else if (bitsCount < 32) {
            return Integer.fromBits(this.low << bitsCount, this.high << bitsCount | this.low >>> 32 - bitsCount);
        } else {
            return Integer.fromBits(0, this.low << bitsCount - 32);
        }
    };
    /**
     * Returns this Integer with bits arithmetically shifted to the right by the given amount.
     * @param {number|!Integer} numBits Number of bits
     * @returns {!Integer} Shifted Integer
     * @expose
     */ Integer.prototype.shiftRight = function(numBits) {
        var bitsCount = Integer.toNumber(numBits);
        var numBitNum = Integer.toNumber(numBits);
        if ((bitsCount &= 63) === 0) {
            return Integer.ZERO;
        } else if (numBitNum < 32) {
            return Integer.fromBits(this.low >>> bitsCount | this.high << 32 - bitsCount, this.high >> bitsCount);
        } else {
            return Integer.fromBits(this.high >> bitsCount - 32, this.high >= 0 ? 0 : -1);
        }
    };
    /**
     * Tests if the specified object is a Integer.
     * @access private
     * @param {*} obj Object
     * @returns {boolean}
     * @expose
     */ Integer.isInteger = function(obj) {
        return (obj === null || obj === void 0 ? void 0 : obj.__isInteger__) === true;
    };
    /**
     * Returns a Integer representing the given 32 bit integer value.
     * @access private
     * @param {number} value The 32 bit integer in question
     * @returns {!Integer} The corresponding Integer value
     * @expose
     */ Integer.fromInt = function(value) {
        var cachedObj;
        value = value | 0;
        if (value >= -128 && value < 128) {
            cachedObj = INT_CACHE.get(value);
            if (cachedObj != null) {
                return cachedObj;
            }
        }
        var obj = new Integer(value, value < 0 ? -1 : 0);
        if (value >= -128 && value < 128) {
            INT_CACHE.set(value, obj);
        }
        return obj;
    };
    /**
     * Returns a Integer representing the 64 bit integer that comes by concatenating the given low and high bits. Each is
     *  assumed to use 32 bits.
     * @access private
     * @param {number} lowBits The low 32 bits
     * @param {number} highBits The high 32 bits
     * @returns {!Integer} The corresponding Integer value
     * @expose
     */ Integer.fromBits = function(lowBits, highBits) {
        return new Integer(lowBits, highBits);
    };
    /**
     * Returns a Integer representing the given value, provided that it is a finite number. Otherwise, zero is returned.
     * @access private
     * @param {number} value The number in question
     * @returns {!Integer} The corresponding Integer value
     * @expose
     */ Integer.fromNumber = function(value) {
        if (isNaN(value) || !isFinite(value)) {
            return Integer.ZERO;
        }
        if (value <= -TWO_PWR_63_DBL) {
            return Integer.MIN_VALUE;
        }
        if (value + 1 >= TWO_PWR_63_DBL) {
            return Integer.MAX_VALUE;
        }
        if (value < 0) {
            return Integer.fromNumber(-value).negate();
        }
        return new Integer(value % TWO_PWR_32_DBL | 0, value / TWO_PWR_32_DBL | 0);
    };
    /**
     * Returns a Integer representation of the given string, written using the specified radix.
     * @access private
     * @param {string} str The textual representation of the Integer
     * @param {number=} radix The radix in which the text is written (2-36), defaults to 10
     * @param {Object} [opts={}] Configuration options
     * @param {boolean} [opts.strictStringValidation=false] Enable strict validation generated Integer.
     * @returns {!Integer} The corresponding Integer value
     * @expose
     */ Integer.fromString = function(str, radix, _a) {
        var _b = _a === void 0 ? {} : _a, strictStringValidation = _b.strictStringValidation;
        if (str.length === 0) {
            throw (0, error_1.newError)('number format error: empty string');
        }
        if (str === 'NaN' || str === 'Infinity' || str === '+Infinity' || str === '-Infinity') {
            return Integer.ZERO;
        }
        radix = radix !== null && radix !== void 0 ? radix : 10;
        if (radix < 2 || radix > 36) {
            throw (0, error_1.newError)('radix out of range: ' + radix.toString());
        }
        var p;
        if ((p = str.indexOf('-')) > 0) {
            throw (0, error_1.newError)('number format error: interior "-" character: ' + str);
        } else if (p === 0) {
            return Integer.fromString(str.substring(1), radix).negate();
        }
        // Do several (8) digits each time through the loop, so as to
        // minimize the calls to the very expensive emulated div.
        var radixToPower = Integer.fromNumber(Math.pow(radix, 8));
        var result = Integer.ZERO;
        for(var i = 0; i < str.length; i += 8){
            var size = Math.min(8, str.length - i);
            var valueString = str.substring(i, i + size);
            var value = parseInt(valueString, radix);
            if (strictStringValidation === true && !_isValidNumberFromString(valueString, value, radix)) {
                throw (0, error_1.newError)("number format error: \"".concat(valueString, "\" is NaN in radix ").concat(radix, ": ").concat(str));
            }
            if (size < 8) {
                var power = Integer.fromNumber(Math.pow(radix, size));
                result = result.multiply(power).add(Integer.fromNumber(value));
            } else {
                result = result.multiply(radixToPower);
                result = result.add(Integer.fromNumber(value));
            }
        }
        return result;
    };
    /**
     * Converts the specified value to a Integer.
     * @access private
     * @param {!Integer|number|string|bigint|!{low: number, high: number}} val Value
     * @param {Object} [opts={}] Configuration options
     * @param {boolean} [opts.strictStringValidation=false] Enable strict validation generated Integer.
     * @param {boolean} [opts.ceilFloat=false] Enable round up float to the nearest Integer.
     * @returns {!Integer}
     * @expose
     */ Integer.fromValue = function(val, opts) {
        if (opts === void 0) {
            opts = {};
        }
        if (val /* is compatible */  instanceof Integer) {
            return val;
        }
        if (typeof val === 'number') {
            if (opts.ceilFloat === true) {
                val = Math.ceil(val);
            }
            return Integer.fromNumber(val);
        }
        if (typeof val === 'string') {
            return Integer.fromString(val, undefined, opts);
        }
        if (typeof val === 'bigint') {
            return Integer.fromString(val.toString());
        }
        // Throws for non-objects, converts non-instanceof Integer:
        return new Integer(val.low, val.high);
    };
    /**
     * Converts the specified value to a number.
     * @access private
     * @param {!Integer|number|string|!{low: number, high: number}} val Value
     * @returns {number}
     * @expose
     */ Integer.toNumber = function(val) {
        switch(typeof val){
            case 'number':
                return val;
            case 'bigint':
                return Number(val);
            default:
                return Integer.fromValue(val).toNumber();
        }
    };
    /**
     * Converts the specified value to a string.
     * @access private
     * @param {!Integer|number|string|!{low: number, high: number}} val Value
     * @param {number} radix optional radix for string conversion, defaults to 10
     * @returns {string}
     * @expose
     */ Integer.toString = function(val, radix) {
        return Integer.fromValue(val).toString(radix);
    };
    /**
     * Checks if the given value is in the safe range in order to be converted to a native number
     * @access private
     * @param {!Integer|number|string|!{low: number, high: number}} val Value
     * @param {number} radix optional radix for string conversion, defaults to 10
     * @returns {boolean}
     * @expose
     */ Integer.inSafeRange = function(val) {
        return Integer.fromValue(val).inSafeRange();
    };
    /**
     * Signed zero.
     * @type {!Integer}
     * @expose
     */ Integer.ZERO = Integer.fromInt(0);
    /**
     * Signed one.
     * @type {!Integer}
     * @expose
     */ Integer.ONE = Integer.fromInt(1);
    /**
     * Signed negative one.
     * @type {!Integer}
     * @expose
     */ Integer.NEG_ONE = Integer.fromInt(-1);
    /**
     * Maximum signed value.
     * @type {!Integer}
     * @expose
     */ Integer.MAX_VALUE = Integer.fromBits(0xffffffff | 0, 0x7fffffff | 0);
    /**
     * Minimum signed value.
     * @type {!Integer}
     * @expose
     */ Integer.MIN_VALUE = Integer.fromBits(0, 0x80000000 | 0);
    /**
     * Minimum safe value.
     * @type {!Integer}
     * @expose
     */ Integer.MIN_SAFE_VALUE = Integer.fromBits(0x1 | 0, 0xffffffffffe00000 | 0);
    /**
     * Maximum safe value.
     * @type {!Integer}
     * @expose
     */ Integer.MAX_SAFE_VALUE = Integer.fromBits(0xffffffff | 0, 0x1fffff | 0);
    /**
     * An indicator used to reliably determine if an object is a Integer or not.
     * @type {boolean}
     * @const
     * @expose
     * @private
     */ Integer.__isInteger__ = true;
    return Integer;
}();
/**
 * @private
 * @param num
 * @param radix
 * @param minSize
 * @returns {string}
 */ function _convertNumberToString(num, radix, minSize) {
    var theNumberString = num.toString(radix);
    var paddingLength = Math.max(minSize - theNumberString.length, 0);
    var padding = '0'.repeat(paddingLength);
    return "".concat(padding).concat(theNumberString);
}
/**
 *
 * @private
 * @param theString
 * @param theNumber
 * @param radix
 * @return {boolean} True if valid
 */ function _isValidNumberFromString(theString, theNumber, radix) {
    return !Number.isNaN(theString) && !Number.isNaN(theNumber) && _convertNumberToString(theNumber, radix, theString.length) === theString.toLowerCase();
}
Object.defineProperty(Integer.prototype, '__isInteger__', {
    value: true,
    enumerable: false,
    configurable: false
});
/**
 * @type {number}
 * @const
 * @inner
 * @private
 */ var TWO_PWR_16_DBL = 1 << 16;
/**
 * @type {number}
 * @const
 * @inner
 * @private
 */ var TWO_PWR_24_DBL = 1 << 24;
/**
 * @type {number}
 * @const
 * @inner
 * @private
 */ var TWO_PWR_32_DBL = TWO_PWR_16_DBL * TWO_PWR_16_DBL;
/**
 * @type {number}
 * @const
 * @inner
 * @private
 */ var TWO_PWR_64_DBL = TWO_PWR_32_DBL * TWO_PWR_32_DBL;
/**
 * @type {number}
 * @const
 * @inner
 * @private
 */ var TWO_PWR_63_DBL = TWO_PWR_64_DBL / 2;
/**
 * @type {!Integer}
 * @const
 * @inner
 * @private
 */ var TWO_PWR_24 = Integer.fromInt(TWO_PWR_24_DBL);
/**
 * Cast value to Integer type.
 * @access public
 * @param {Mixed} value - The value to use.
 * @param {Object} [opts={}] Configuration options
 * @param {boolean} [opts.strictStringValidation=false] Enable strict validation generated Integer.
 * @param {boolean} [opts.ceilFloat=false] Enable round up float to the nearest Integer.
 * @return {Integer} - An object of type Integer.
 */ var int = Integer.fromValue;
exports.int = int;
/**
 * Check if a variable is of Integer type.
 * @access public
 * @param {Mixed} value - The variable to check.
 * @return {Boolean} - Is it of the Integer type?
 */ var isInt = Integer.isInteger;
exports.isInt = isInt;
/**
 * Check if a variable can be safely converted to a number
 * @access public
 * @param {Mixed} value - The variable to check
 * @return {Boolean} - true if it is safe to call toNumber on variable otherwise false
 */ var inSafeRange = Integer.inSafeRange;
exports.inSafeRange = inSafeRange;
/**
 * Converts a variable to a number
 * @access public
 * @param {Mixed} value - The variable to convert
 * @return {number} - the variable as a number
 */ var toNumber = Integer.toNumber;
exports.toNumber = toNumber;
/**
 * Converts the integer to a string representation
 * @access public
 * @param {Mixed} value - The variable to convert
 * @param {number} radix - radix to use in string conversion, defaults to 10
 * @return {string} - returns a string representation of the integer
 */ var toString = Integer.toString;
exports.toString = toString;
exports.default = Integer;
}),
"[project]/frontend/node_modules/neo4j-driver-core/lib/internal/util.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __createBinding = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__createBinding || (Object.create ? function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = {
            enumerable: true,
            get: function() {
                return m[k];
            }
        };
    }
    Object.defineProperty(o, k2, desc);
} : function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
});
var __setModuleDefault = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__setModuleDefault || (Object.create ? function(o, v) {
    Object.defineProperty(o, "default", {
        enumerable: true,
        value: v
    });
} : function(o, v) {
    o["default"] = v;
});
var __importStar = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__importStar || function() {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function(o) {
            var ar = [];
            for(var k in o)if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function(mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) {
            for(var k = ownKeys(mod), i = 0; i < k.length; i++)if (k[i] !== "default") __createBinding(result, mod, k[i]);
        }
        __setModuleDefault(result, mod);
        return result;
    };
}();
var __values = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__values || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function() {
            if (o && i >= o.length) o = void 0;
            return {
                value: o && o[i++],
                done: !o
            };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ENCRYPTION_OFF = exports.ENCRYPTION_ON = void 0;
exports.isEmptyObjectOrNull = isEmptyObjectOrNull;
exports.isObject = isObject;
exports.isString = isString;
exports.assertObject = assertObject;
exports.assertString = assertString;
exports.assertNumber = assertNumber;
exports.assertNumberOrInteger = assertNumberOrInteger;
exports.assertValidDate = assertValidDate;
exports.toNumber = toNumber;
exports.validateQueryAndParameters = validateQueryAndParameters;
exports.equals = equals;
/**
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [https://neo4j.com]
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ // eslint-disable-next-line @typescript-eslint/no-unused-vars
var integer_1 = __importStar(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/integer.js [app-route] (ecmascript)"));
var json_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/json.js [app-route] (ecmascript)");
var ENCRYPTION_ON = 'ENCRYPTION_ON';
exports.ENCRYPTION_ON = ENCRYPTION_ON;
var ENCRYPTION_OFF = 'ENCRYPTION_OFF';
exports.ENCRYPTION_OFF = ENCRYPTION_OFF;
/**
 * Verifies if the object is null or empty
 * @param obj The subject object
 * @returns {boolean} True if it's empty object or null
 */ function isEmptyObjectOrNull(obj) {
    if (obj === null) {
        return true;
    }
    if (!isObject(obj)) {
        return false;
    }
    for(var prop in obj){
        if (obj[prop] !== undefined) {
            return false;
        }
    }
    return true;
}
/**
 * Verify if it's an object
 * @param obj The subject
 * @returns {boolean} True if it's an object
 */ function isObject(obj) {
    return typeof obj === 'object' && !Array.isArray(obj) && obj !== null;
}
/**
 * Check and normalize given query and parameters.
 * @param {string|{text: string, parameters: Object}} query the query to check.
 * @param {Object} parameters
 * @return {{validatedQuery: string|{text: string, parameters: Object}, params: Object}} the normalized query with parameters.
 * @throws TypeError when either given query or parameters are invalid.
 */ function validateQueryAndParameters(query, parameters, opt) {
    var _a, _b;
    var validatedQuery = '';
    var params = parameters !== null && parameters !== void 0 ? parameters : {};
    var skipAsserts = (_a = opt === null || opt === void 0 ? void 0 : opt.skipAsserts) !== null && _a !== void 0 ? _a : false;
    if (typeof query === 'string') {
        validatedQuery = query;
    } else if (query instanceof String) {
        validatedQuery = query.toString();
    } else if (typeof query === 'object' && query.text != null) {
        validatedQuery = query.text;
        params = (_b = query.parameters) !== null && _b !== void 0 ? _b : {};
    }
    if (!skipAsserts) {
        assertCypherQuery(validatedQuery);
        assertQueryParameters(params);
    }
    return {
        validatedQuery: validatedQuery,
        params: params
    };
}
/**
 * Assert it's a object
 * @param {any} obj The subject
 * @param {string} objName The object name
 * @returns {object} The subject object
 * @throws {TypeError} when the supplied param is not an object
 */ function assertObject(obj, objName) {
    if (!isObject(obj)) {
        throw new TypeError(objName + ' expected to be an object but was: ' + (0, json_1.stringify)(obj));
    }
    return obj;
}
/**
 * Assert it's a string
 * @param {any} obj The subject
 * @param {string} objName The object name
 * @returns {string} The subject string
 * @throws {TypeError} when the supplied param is not a string
 */ function assertString(obj, objName) {
    if (!isString(obj)) {
        throw new TypeError((0, json_1.stringify)(objName) + ' expected to be string but was: ' + (0, json_1.stringify)(obj));
    }
    return obj;
}
/**
 * Assert it's a number
 * @param {any} obj The subject
 * @param {string} objName The object name
 * @returns {number} The number
 * @throws {TypeError} when the supplied param is not a number
 */ function assertNumber(obj, objName) {
    if (typeof obj !== 'number') {
        throw new TypeError(objName + ' expected to be a number but was: ' + (0, json_1.stringify)(obj));
    }
    return obj;
}
/**
 * Assert it's a number or integer
 * @param {any} obj The subject
 * @param {string} objName The object name
 * @returns {number|Integer} The subject object
 * @throws {TypeError} when the supplied param is not a number or integer
 */ function assertNumberOrInteger(obj, objName) {
    if (typeof obj !== 'number' && typeof obj !== 'bigint' && !(0, integer_1.isInt)(obj)) {
        throw new TypeError(objName + ' expected to be either a number or an Integer object but was: ' + (0, json_1.stringify)(obj));
    }
    return obj;
}
/**
 * Assert it's a valid datae
 * @param {any} obj The subject
 * @param {string} objName The object name
 * @returns {Date} The valida date
 * @throws {TypeError} when the supplied param is not a valid date
 */ function assertValidDate(obj, objName) {
    if (Object.prototype.toString.call(obj) !== '[object Date]') {
        throw new TypeError(objName + ' expected to be a standard JavaScript Date but was: ' + (0, json_1.stringify)(obj));
    }
    if (Number.isNaN(obj.getTime())) {
        throw new TypeError(objName + ' expected to be valid JavaScript Date but its time was NaN: ' + (0, json_1.stringify)(obj));
    }
    return obj;
}
/**
 * Validates a cypher query string
 * @param {any} obj The query
 * @returns {void}
 * @throws {TypeError} if the query is not valid
 */ function assertCypherQuery(obj) {
    assertString(obj, 'Cypher query');
    if (obj.trim().length === 0) {
        throw new TypeError('Cypher query is expected to be a non-empty string.');
    }
}
/**
 * Validates if the query parameters is an object
 * @param {any} obj The parameters
 * @returns {void}
 * @throws {TypeError} if the parameters is not valid
 */ function assertQueryParameters(obj) {
    if (!isObject(obj)) {
        // objects created with `Object.create(null)` do not have a constructor property
        // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
        var constructor = obj.constructor != null ? ' ' + obj.constructor.name : '';
        throw new TypeError("Query parameters are expected to either be undefined/null or an object, given:".concat(constructor, " ").concat(JSON.stringify(obj)));
    }
}
/**
 * Verify if the supplied object is a string
 *
 * @param str The string
 * @returns {boolean} True if the supplied object is an string
 */ function isString(str) {
    return Object.prototype.toString.call(str) === '[object String]';
}
/**
 * Verifies if object are the equals
 * @param {unknown} a
 * @param {unknown} b
 * @returns {boolean}
 */ function equals(a, b) {
    var e_1, _a;
    if (a === b) {
        return true;
    }
    if (a === null || b === null) {
        return false;
    }
    if (typeof a === 'object' && typeof b === 'object') {
        var keysA = Object.keys(a);
        var keysB = Object.keys(b);
        if (keysA.length !== keysB.length) {
            return false;
        }
        try {
            for(var keysA_1 = __values(keysA), keysA_1_1 = keysA_1.next(); !keysA_1_1.done; keysA_1_1 = keysA_1.next()){
                var key = keysA_1_1.value;
                if (!equals(a[key], b[key])) {
                    return false;
                }
            }
        } catch (e_1_1) {
            e_1 = {
                error: e_1_1
            };
        } finally{
            try {
                if (keysA_1_1 && !keysA_1_1.done && (_a = keysA_1.return)) _a.call(keysA_1);
            } finally{
                if (e_1) throw e_1.error;
            }
        }
        return true;
    }
    return false;
}
/**
 * Converts (Integer | bigint) to number.
 *
 * @private
 * @param {NumberOrInteger} value The number or integer
 * @returns {number} The number
 */ function toNumber(value) {
    if (value instanceof integer_1.default) {
        return value.toNumber();
    } else if (typeof value === 'bigint') {
        return (0, integer_1.int)(value).toNumber();
    } else {
        return value;
    }
}
}),
"[project]/frontend/node_modules/neo4j-driver-core/lib/internal/temporal-util.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/**
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [https://neo4j.com]
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ var __createBinding = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__createBinding || (Object.create ? function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = {
            enumerable: true,
            get: function() {
                return m[k];
            }
        };
    }
    Object.defineProperty(o, k2, desc);
} : function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
});
var __setModuleDefault = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__setModuleDefault || (Object.create ? function(o, v) {
    Object.defineProperty(o, "default", {
        enumerable: true,
        value: v
    });
} : function(o, v) {
    o["default"] = v;
});
var __importStar = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__importStar || function() {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function(o) {
            var ar = [];
            for(var k in o)if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function(mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) {
            for(var k = ownKeys(mod), i = 0; i < k.length; i++)if (k[i] !== "default") __createBinding(result, mod, k[i]);
        }
        __setModuleDefault(result, mod);
        return result;
    };
}();
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.SECONDS_PER_DAY = exports.DAYS_PER_400_YEAR_CYCLE = exports.DAYS_0000_TO_1970 = exports.NANOS_PER_HOUR = exports.NANOS_PER_MINUTE = exports.NANOS_PER_MILLISECOND = exports.NANOS_PER_SECOND = exports.SECONDS_PER_HOUR = exports.SECONDS_PER_MINUTE = exports.MINUTES_PER_HOUR = exports.NANOSECOND_OF_SECOND_RANGE = exports.SECOND_OF_MINUTE_RANGE = exports.MINUTE_OF_HOUR_RANGE = exports.HOUR_OF_DAY_RANGE = exports.DAY_OF_MONTH_RANGE = exports.MONTH_OF_YEAR_RANGE = exports.YEAR_RANGE = void 0;
exports.normalizeYearsForDuration = normalizeYearsForDuration;
exports.normalizeMonthsForDuration = normalizeMonthsForDuration;
exports.normalizeHoursForDuration = normalizeHoursForDuration;
exports.normalizeMinutesForDuration = normalizeMinutesForDuration;
exports.normalizeSecondsForDuration = normalizeSecondsForDuration;
exports.normalizeNanosecondsForDuration = normalizeNanosecondsForDuration;
exports.localTimeToNanoOfDay = localTimeToNanoOfDay;
exports.localDateTimeToEpochSecond = localDateTimeToEpochSecond;
exports.dateToEpochDay = dateToEpochDay;
exports.durationToIsoString = durationToIsoString;
exports.timeToIsoString = timeToIsoString;
exports.timeZoneOffsetToIsoString = timeZoneOffsetToIsoString;
exports.dateToIsoString = dateToIsoString;
exports.isoStringToStandardDate = isoStringToStandardDate;
exports.toStandardDate = toStandardDate;
exports.newDate = newDate;
exports.totalNanoseconds = totalNanoseconds;
exports.timeZoneOffsetInSeconds = timeZoneOffsetInSeconds;
exports.assertValidYear = assertValidYear;
exports.assertValidMonth = assertValidMonth;
exports.assertValidDay = assertValidDay;
exports.assertValidHour = assertValidHour;
exports.assertValidMinute = assertValidMinute;
exports.assertValidSecond = assertValidSecond;
exports.assertValidNanosecond = assertValidNanosecond;
exports.assertValidZoneId = assertValidZoneId;
exports.floorDiv = floorDiv;
exports.floorMod = floorMod;
var integer_1 = __importStar(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/integer.js [app-route] (ecmascript)"));
var error_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/error.js [app-route] (ecmascript)");
var util_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/internal/util.js [app-route] (ecmascript)");
/*
  Code in this util should be compatible with code in the database that uses JSR-310 java.time APIs.

  It is based on a library called ThreeTen (https://github.com/ThreeTen/threetenbp) which was derived
  from JSR-310 reference implementation previously hosted on GitHub. Code uses `Integer` type everywhere
  to correctly handle large integer values that are greater than `Number.MAX_SAFE_INTEGER`.

  Please consult either ThreeTen or js-joda (https://github.com/js-joda/js-joda) when working with the
  conversion functions.
 */ var ValueRange = function() {
    function ValueRange(min, max) {
        this._minNumber = min;
        this._maxNumber = max;
        this._minInteger = (0, integer_1.int)(min);
        this._maxInteger = (0, integer_1.int)(max);
    }
    ValueRange.prototype.contains = function(value) {
        if ((0, integer_1.isInt)(value) && value instanceof integer_1.default) {
            return value.greaterThanOrEqual(this._minInteger) && value.lessThanOrEqual(this._maxInteger);
        } else if (typeof value === 'bigint') {
            var intValue = (0, integer_1.int)(value);
            return intValue.greaterThanOrEqual(this._minInteger) && intValue.lessThanOrEqual(this._maxInteger);
        } else {
            return value >= this._minNumber && value <= this._maxNumber;
        }
    };
    ValueRange.prototype.toString = function() {
        return "[".concat(this._minNumber, ", ").concat(this._maxNumber, "]");
    };
    return ValueRange;
}();
exports.YEAR_RANGE = new ValueRange(-999999999, 999999999);
exports.MONTH_OF_YEAR_RANGE = new ValueRange(1, 12);
exports.DAY_OF_MONTH_RANGE = new ValueRange(1, 31);
exports.HOUR_OF_DAY_RANGE = new ValueRange(0, 23);
exports.MINUTE_OF_HOUR_RANGE = new ValueRange(0, 59);
exports.SECOND_OF_MINUTE_RANGE = new ValueRange(0, 59);
exports.NANOSECOND_OF_SECOND_RANGE = new ValueRange(0, 999999999);
exports.MINUTES_PER_HOUR = 60;
exports.SECONDS_PER_MINUTE = 60;
exports.SECONDS_PER_HOUR = exports.SECONDS_PER_MINUTE * exports.MINUTES_PER_HOUR;
exports.NANOS_PER_SECOND = 1000000000;
exports.NANOS_PER_MILLISECOND = 1000000;
exports.NANOS_PER_MINUTE = exports.NANOS_PER_SECOND * exports.SECONDS_PER_MINUTE;
exports.NANOS_PER_HOUR = exports.NANOS_PER_MINUTE * exports.MINUTES_PER_HOUR;
exports.DAYS_0000_TO_1970 = 719528;
exports.DAYS_PER_400_YEAR_CYCLE = 146097;
exports.SECONDS_PER_DAY = 86400;
function normalizeYearsForDuration(months) {
    return (0, integer_1.int)(months).div(12);
}
function normalizeMonthsForDuration(months) {
    return (0, integer_1.int)(months).modulo(12);
}
function normalizeHoursForDuration(seconds, nanoseconds) {
    if ((0, integer_1.int)(nanoseconds).greaterThan(0) && (0, integer_1.int)(seconds).lessThan(0)) {
        seconds = (0, integer_1.int)(seconds).add(1);
    }
    return (0, integer_1.int)(seconds).div(exports.SECONDS_PER_HOUR);
}
function normalizeMinutesForDuration(seconds, nanoseconds) {
    if ((0, integer_1.int)(nanoseconds).greaterThan(0) && (0, integer_1.int)(seconds).lessThan(0)) {
        seconds = (0, integer_1.int)(seconds).add(1);
    }
    var minutes = (0, integer_1.int)(seconds).div(exports.SECONDS_PER_MINUTE);
    var negativeMinutes = minutes.isNegative();
    if (negativeMinutes) {
        minutes = minutes.negate();
    }
    return floorMod(minutes, exports.MINUTES_PER_HOUR).multiply(negativeMinutes ? -1 : 1);
}
function normalizeSecondsForDuration(seconds, nanoseconds) {
    return (0, integer_1.int)(seconds).add(floorDiv(nanoseconds, exports.NANOS_PER_SECOND));
}
function normalizeNanosecondsForDuration(nanoseconds) {
    return floorMod(nanoseconds, exports.NANOS_PER_SECOND);
}
/**
 * Converts given local time into a single integer representing this same time in nanoseconds of the day.
 * @param {Integer|number|string} hour the hour of the local time to convert.
 * @param {Integer|number|string} minute the minute of the local time to convert.
 * @param {Integer|number|string} second the second of the local time to convert.
 * @param {Integer|number|string} nanosecond the nanosecond of the local time to convert.
 * @return {Integer} nanoseconds representing the given local time.
 */ function localTimeToNanoOfDay(hour, minute, second, nanosecond) {
    hour = (0, integer_1.int)(hour);
    minute = (0, integer_1.int)(minute);
    second = (0, integer_1.int)(second);
    nanosecond = (0, integer_1.int)(nanosecond);
    var totalNanos = hour.multiply(exports.NANOS_PER_HOUR);
    totalNanos = totalNanos.add(minute.multiply(exports.NANOS_PER_MINUTE));
    totalNanos = totalNanos.add(second.multiply(exports.NANOS_PER_SECOND));
    return totalNanos.add(nanosecond);
}
/**
 * Converts given local date time into a single integer representing this same time in epoch seconds UTC.
 * @param {Integer|number|string} year the year of the local date-time to convert.
 * @param {Integer|number|string} month the month of the local date-time to convert.
 * @param {Integer|number|string} day the day of the local date-time to convert.
 * @param {Integer|number|string} hour the hour of the local date-time to convert.
 * @param {Integer|number|string} minute the minute of the local date-time to convert.
 * @param {Integer|number|string} second the second of the local date-time to convert.
 * @param {Integer|number|string} nanosecond the nanosecond of the local date-time to convert.
 * @return {Integer} epoch second in UTC representing the given local date time.
 */ function localDateTimeToEpochSecond(year, month, day, hour, minute, second, nanosecond) {
    var epochDay = dateToEpochDay(year, month, day);
    var localTimeSeconds = localTimeToSecondOfDay(hour, minute, second);
    return epochDay.multiply(exports.SECONDS_PER_DAY).add(localTimeSeconds);
}
/**
 * Converts given local date into a single integer representing it's epoch day.
 * @param {Integer|number|string} year the year of the local date to convert.
 * @param {Integer|number|string} month the month of the local date to convert.
 * @param {Integer|number|string} day the day of the local date to convert.
 * @return {Integer} epoch day representing the given date.
 */ function dateToEpochDay(year, month, day) {
    year = (0, integer_1.int)(year);
    month = (0, integer_1.int)(month);
    day = (0, integer_1.int)(day);
    var epochDay = year.multiply(365);
    if (year.greaterThanOrEqual(0)) {
        epochDay = epochDay.add(year.add(3).div(4).subtract(year.add(99).div(100)).add(year.add(399).div(400)));
    } else {
        epochDay = epochDay.subtract(year.div(-4).subtract(year.div(-100)).add(year.div(-400)));
    }
    epochDay = epochDay.add(month.multiply(367).subtract(362).div(12));
    epochDay = epochDay.add(day.subtract(1));
    if (month.greaterThan(2)) {
        epochDay = epochDay.subtract(1);
        if (!isLeapYear(year)) {
            epochDay = epochDay.subtract(1);
        }
    }
    return epochDay.subtract(exports.DAYS_0000_TO_1970);
}
/**
 * Format given duration to an ISO 8601 string.
 * @param {Integer|number|string} months the number of months.
 * @param {Integer|number|string} days the number of days.
 * @param {Integer|number|string} seconds the number of seconds.
 * @param {Integer|number|string} nanoseconds the number of nanoseconds.
 * @return {string} ISO string that represents given duration.
 */ function durationToIsoString(months, days, seconds, nanoseconds) {
    if ((0, integer_1.int)(months).equals(0) && (0, integer_1.int)(days).equals(0) && (0, integer_1.int)(seconds).equals(0) && (0, integer_1.int)(nanoseconds).equals(0)) {
        return 'PT0S';
    }
    var yearString = formatNumber(normalizeYearsForDuration(months));
    var monthString = formatNumber(normalizeMonthsForDuration(months));
    var dayString = formatNumber(days);
    var hourString = formatNumber(normalizeHoursForDuration(seconds, nanoseconds));
    var minuteString = formatNumber(normalizeMinutesForDuration(seconds, nanoseconds));
    var secondsAndNanosecondsString = formatSecondsAndNanosecondsForDuration(seconds, nanoseconds);
    return "P".concat(yearString !== '0' ? yearString + 'Y' : '') + "".concat(monthString !== '0' ? monthString + 'M' : '') + "".concat(dayString !== '0' ? dayString + 'D' : '', "T") + "".concat(hourString !== '0' ? hourString + 'H' : '') + "".concat(minuteString !== '0' ? minuteString + 'M' : '') + "".concat(secondsAndNanosecondsString !== '0' ? secondsAndNanosecondsString + 'S' : '');
}
/**
 * Formats given time to an ISO 8601 string.
 * @param {Integer|number|string} hour the hour value.
 * @param {Integer|number|string} minute the minute value.
 * @param {Integer|number|string} second the second value.
 * @param {Integer|number|string} nanosecond the nanosecond value.
 * @return {string} ISO string that represents given time.
 */ function timeToIsoString(hour, minute, second, nanosecond) {
    var hourString = formatNumber(hour, 2);
    var minuteString = formatNumber(minute, 2);
    var secondString = formatNumber(second, 2);
    var nanosecondString = formatNanosecond(nanosecond);
    return "".concat(hourString, ":").concat(minuteString, ":").concat(secondString).concat(nanosecondString);
}
/**
 * Formats given time zone offset in seconds to string representation like '±HH:MM', '±HH:MM:SS' or 'Z' for UTC.
 * @param {Integer|number|string} offsetSeconds the offset in seconds.
 * @return {string} ISO string that represents given offset.
 */ function timeZoneOffsetToIsoString(offsetSeconds) {
    offsetSeconds = (0, integer_1.int)(offsetSeconds);
    if (offsetSeconds.equals(0)) {
        return 'Z';
    }
    var isNegative = offsetSeconds.isNegative();
    if (isNegative) {
        offsetSeconds = offsetSeconds.multiply(-1);
    }
    var signPrefix = isNegative ? '-' : '+';
    var hours = formatNumber(offsetSeconds.div(exports.SECONDS_PER_HOUR), 2);
    var minutes = formatNumber(offsetSeconds.div(exports.SECONDS_PER_MINUTE).modulo(exports.MINUTES_PER_HOUR), 2);
    var secondsValue = offsetSeconds.modulo(exports.SECONDS_PER_MINUTE);
    var seconds = secondsValue.equals(0) ? null : formatNumber(secondsValue, 2);
    return seconds != null ? "".concat(signPrefix).concat(hours, ":").concat(minutes, ":").concat(seconds) : "".concat(signPrefix).concat(hours, ":").concat(minutes);
}
/**
 * Formats given date to an ISO 8601 string.
 * @param {Integer|number|string} year the date year.
 * @param {Integer|number|string} month the date month.
 * @param {Integer|number|string} day the date day.
 * @return {string} ISO string that represents given date.
 */ function dateToIsoString(year, month, day) {
    var yearString = formatYear(year);
    var monthString = formatNumber(month, 2);
    var dayString = formatNumber(day, 2);
    return "".concat(yearString, "-").concat(monthString, "-").concat(dayString);
}
/**
 * Convert the given iso date string to a JavaScript Date object
 *
 * @param {string} isoString The iso date string
 * @returns {Date} the date
 */ function isoStringToStandardDate(isoString) {
    return new Date(isoString);
}
/**
 * Convert the given utc timestamp to a JavaScript Date object
 *
 * @param {number} utc Timestamp in UTC
 * @returns {Date} the date
 */ function toStandardDate(utc) {
    return new Date(utc);
}
/**
 * Shortcut for creating a new StandardDate
 * @param date
 * @returns {Date} the standard date
 */ function newDate(date) {
    return new Date(date);
}
/**
 * Get the total number of nanoseconds from the milliseconds of the given standard JavaScript date and optional nanosecond part.
 * @param {global.Date} standardDate the standard JavaScript date.
 * @param {Integer|number|bigint|undefined} nanoseconds the optional number of nanoseconds.
 * @return {Integer|number|bigint} the total amount of nanoseconds.
 */ function totalNanoseconds(standardDate, nanoseconds) {
    nanoseconds = nanoseconds !== null && nanoseconds !== void 0 ? nanoseconds : 0;
    var nanosFromMillis = standardDate.getMilliseconds() * exports.NANOS_PER_MILLISECOND;
    return add(nanoseconds, nanosFromMillis);
}
/**
 * Get the time zone offset in seconds from the given standard JavaScript date.
 *
 * @param {global.Date} standardDate the standard JavaScript date.
 * @return {number} the time zone offset in seconds.
 */ function timeZoneOffsetInSeconds(standardDate) {
    var secondsPortion = standardDate.getSeconds() - standardDate.getUTCSeconds();
    var minutesPortion = standardDate.getMinutes() - standardDate.getUTCMinutes();
    var hoursPortion = standardDate.getHours() - standardDate.getUTCHours();
    var daysPortion = _getDayOffset(standardDate);
    return hoursPortion * exports.SECONDS_PER_HOUR + minutesPortion * exports.SECONDS_PER_MINUTE + secondsPortion + daysPortion * exports.SECONDS_PER_DAY;
}
/**
 * Get the difference in days from the given JavaScript date in local time and UTC.
 *
 * @private
 * @param {global.Date} standardDate the date to evaluate
 * @returns  {number} the difference in days between date local time and UTC
 */ function _getDayOffset(standardDate) {
    if (standardDate.getMonth() === standardDate.getUTCMonth()) {
        return standardDate.getDate() - standardDate.getUTCDate();
    } else if (standardDate.getFullYear() > standardDate.getUTCFullYear() || standardDate.getMonth() > standardDate.getUTCMonth() && standardDate.getFullYear() === standardDate.getUTCFullYear()) {
        return standardDate.getDate() + _daysUntilNextMonth(standardDate.getUTCMonth(), standardDate.getUTCFullYear()) - standardDate.getUTCDate();
    } else {
        return standardDate.getDate() - (standardDate.getUTCDate() + _daysUntilNextMonth(standardDate.getMonth(), standardDate.getFullYear()));
    }
}
/**
 * Get the number of days in a month, including a check for leap years.
 *
 * @private
 * @param {number} month the month of the date to evalutate
 * @param {number} year the month of the date to evalutate
 * @returns {number} the total number of days in the month evaluated
 */ function _daysUntilNextMonth(month, year) {
    if (month === 1) {
        if (year % 400 === 0 || year % 4 === 0 && year % 100 !== 0) {
            return 29;
        } else {
            return 28;
        }
    } else if ([
        0,
        2,
        4,
        6,
        7,
        9,
        11
    ].includes(month)) {
        return 31;
    } else {
        return 30;
    }
}
/**
 * Assert that the year value is valid.
 * @param {Integer|number} year the value to check.
 * @return {Integer|number} the value of the year if it is valid. Exception is thrown otherwise.
 */ function assertValidYear(year) {
    return assertValidTemporalValue(year, exports.YEAR_RANGE, 'Year');
}
/**
 * Assert that the month value is valid.
 * @param {Integer|number} month the value to check.
 * @return {Integer|number} the value of the month if it is valid. Exception is thrown otherwise.
 */ function assertValidMonth(month) {
    return assertValidTemporalValue(month, exports.MONTH_OF_YEAR_RANGE, 'Month');
}
/**
 * Assert that the day value is valid.
 * @param {Integer|number} day the value to check.
 * @return {Integer|number} the value of the day if it is valid. Exception is thrown otherwise.
 */ function assertValidDay(day) {
    return assertValidTemporalValue(day, exports.DAY_OF_MONTH_RANGE, 'Day');
}
/**
 * Assert that the hour value is valid.
 * @param {Integer|number} hour the value to check.
 * @return {Integer|number} the value of the hour if it is valid. Exception is thrown otherwise.
 */ function assertValidHour(hour) {
    return assertValidTemporalValue(hour, exports.HOUR_OF_DAY_RANGE, 'Hour');
}
/**
 * Assert that the minute value is valid.
 * @param {Integer|number} minute the value to check.
 * @return {Integer|number} the value of the minute if it is valid. Exception is thrown otherwise.
 */ function assertValidMinute(minute) {
    return assertValidTemporalValue(minute, exports.MINUTE_OF_HOUR_RANGE, 'Minute');
}
/**
 * Assert that the second value is valid.
 * @param {Integer|number} second the value to check.
 * @return {Integer|number} the value of the second if it is valid. Exception is thrown otherwise.
 */ function assertValidSecond(second) {
    return assertValidTemporalValue(second, exports.SECOND_OF_MINUTE_RANGE, 'Second');
}
/**
 * Assert that the nanosecond value is valid.
 * @param {Integer|number} nanosecond the value to check.
 * @return {Integer|number} the value of the nanosecond if it is valid. Exception is thrown otherwise.
 */ function assertValidNanosecond(nanosecond) {
    return assertValidTemporalValue(nanosecond, exports.NANOSECOND_OF_SECOND_RANGE, 'Nanosecond');
}
var timeZoneValidityCache = new Map();
var newInvalidZoneIdError = function(zoneId, fieldName) {
    return (0, error_1.newError)("".concat(fieldName, " is expected to be a valid ZoneId but was: \"").concat(zoneId, "\""));
};
function assertValidZoneId(fieldName, zoneId) {
    var cachedResult = timeZoneValidityCache.get(zoneId);
    if (cachedResult === true) {
        return;
    }
    if (cachedResult === false) {
        throw newInvalidZoneIdError(zoneId, fieldName);
    }
    try {
        Intl.DateTimeFormat(undefined, {
            timeZone: zoneId
        });
        timeZoneValidityCache.set(zoneId, true);
    } catch (e) {
        timeZoneValidityCache.set(zoneId, false);
        throw newInvalidZoneIdError(zoneId, fieldName);
    }
}
/**
 * Check if the given value is of expected type and is in the expected range.
 * @param {Integer|number} value the value to check.
 * @param {ValueRange} range the range.
 * @param {string} name the name of the value.
 * @return {Integer|number} the value if valid. Exception is thrown otherwise.
 */ function assertValidTemporalValue(value, range, name) {
    (0, util_1.assertNumberOrInteger)(value, name);
    if (!range.contains(value)) {
        throw (0, error_1.newError)("".concat(name, " is expected to be in range ").concat(range.toString(), " but was: ").concat(value.toString()));
    }
    return value;
}
/**
 * Converts given local time into a single integer representing this same time in seconds of the day. Nanoseconds are skipped.
 * @param {Integer|number|string} hour the hour of the local time.
 * @param {Integer|number|string} minute the minute of the local time.
 * @param {Integer|number|string} second the second of the local time.
 * @return {Integer} seconds representing the given local time.
 */ function localTimeToSecondOfDay(hour, minute, second) {
    hour = (0, integer_1.int)(hour);
    minute = (0, integer_1.int)(minute);
    second = (0, integer_1.int)(second);
    var totalSeconds = hour.multiply(exports.SECONDS_PER_HOUR);
    totalSeconds = totalSeconds.add(minute.multiply(exports.SECONDS_PER_MINUTE));
    return totalSeconds.add(second);
}
/**
 * Check if given year is a leap year. Uses algorithm described here {@link https://en.wikipedia.org/wiki/Leap_year#Algorithm}.
 * @param {Integer|number|string} year the year to check. Will be converted to {@link Integer} for all calculations.
 * @return {boolean} `true` if given year is a leap year, `false` otherwise.
 */ function isLeapYear(year) {
    year = (0, integer_1.int)(year);
    if (!year.modulo(4).equals(0)) {
        return false;
    } else if (!year.modulo(100).equals(0)) {
        return true;
    } else if (!year.modulo(400).equals(0)) {
        return false;
    } else {
        return true;
    }
}
/**
 * @param {Integer|number|string} x the divident.
 * @param {Integer|number|string} y the divisor.
 * @return {Integer} the result.
 */ function floorDiv(x, y) {
    x = (0, integer_1.int)(x);
    y = (0, integer_1.int)(y);
    var result = x.div(y);
    if (x.isPositive() !== y.isPositive() && result.multiply(y).notEquals(x)) {
        result = result.subtract(1);
    }
    return result;
}
/**
 * @param {Integer|number|string} x the divident.
 * @param {Integer|number|string} y the divisor.
 * @return {Integer} the result.
 */ function floorMod(x, y) {
    x = (0, integer_1.int)(x);
    y = (0, integer_1.int)(y);
    return x.subtract(floorDiv(x, y).multiply(y));
}
/**
 * @param {Integer|number|string} seconds the number of seconds to format.
 * @param {Integer|number|string} nanoseconds the number of nanoseconds to format.
 * @return {string} formatted value.
 */ function formatSecondsAndNanosecondsForDuration(seconds, nanoseconds) {
    seconds = (0, integer_1.int)(seconds);
    nanoseconds = (0, integer_1.int)(nanoseconds);
    var secondsString;
    var nanosecondsString;
    var secondsNegative = seconds.isNegative();
    var nanosecondsGreaterThanZero = nanoseconds.greaterThan(0);
    if (secondsNegative && nanosecondsGreaterThanZero) {
        seconds = seconds.add(1).negate().modulo(60).negate();
        if (seconds.equals(0)) {
            secondsString = '-0';
        } else {
            secondsString = seconds.toString();
        }
    } else {
        secondsString = seconds.modulo(60).toString();
    }
    if (nanosecondsGreaterThanZero) {
        if (secondsNegative) {
            nanosecondsString = formatNanosecond(nanoseconds.negate().add(2 * exports.NANOS_PER_SECOND).modulo(exports.NANOS_PER_SECOND));
        } else {
            nanosecondsString = formatNanosecond(nanoseconds.add(exports.NANOS_PER_SECOND).modulo(exports.NANOS_PER_SECOND));
        }
    }
    return nanosecondsString != null ? secondsString + nanosecondsString : secondsString;
}
/**
 * @param {Integer|number|string} value the number of nanoseconds to format.
 * @return {string} formatted and possibly left-padded nanoseconds part as string.
 */ function formatNanosecond(value) {
    value = (0, integer_1.int)(value);
    return value.equals(0) ? '' : '.' + formatNumber(value, 9);
}
/**
 *
 * @param {Integer|number|string} year The year to be formatted
 * @return {string} formatted year
 */ function formatYear(year) {
    var yearInteger = (0, integer_1.int)(year);
    if (yearInteger.isNegative() || yearInteger.greaterThan(9999)) {
        return formatNumber(yearInteger, 6, {
            usePositiveSign: true
        });
    }
    return formatNumber(yearInteger, 4);
}
/**
 * @param {Integer|number|string} num the number to format.
 * @param {number} [stringLength=undefined] the string length to left-pad to.
 * @return {string} formatted and possibly left-padded number as string.
 */ function formatNumber(num, stringLength, params) {
    num = (0, integer_1.int)(num);
    var isNegative = num.isNegative();
    if (isNegative) {
        num = num.negate();
    }
    var numString = num.toString();
    if (stringLength != null) {
        // left pad the string with zeroes
        while(numString.length < stringLength){
            numString = '0' + numString;
        }
    }
    if (isNegative) {
        return '-' + numString;
    } else if ((params === null || params === void 0 ? void 0 : params.usePositiveSign) === true) {
        return '+' + numString;
    }
    return numString;
}
function add(x, y) {
    if (x instanceof integer_1.default) {
        return x.add(y);
    } else if (typeof x === 'bigint') {
        return x + BigInt(y);
    }
    return x + y;
}
}),
"[project]/frontend/node_modules/neo4j-driver-core/lib/temporal-types.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/**
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [https://neo4j.com]
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ var __createBinding = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__createBinding || (Object.create ? function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = {
            enumerable: true,
            get: function() {
                return m[k];
            }
        };
    }
    Object.defineProperty(o, k2, desc);
} : function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
});
var __setModuleDefault = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__setModuleDefault || (Object.create ? function(o, v) {
    Object.defineProperty(o, "default", {
        enumerable: true,
        value: v
    });
} : function(o, v) {
    o["default"] = v;
});
var __importStar = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__importStar || function() {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function(o) {
            var ar = [];
            for(var k in o)if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function(mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) {
            for(var k = ownKeys(mod), i = 0; i < k.length; i++)if (k[i] !== "default") __createBinding(result, mod, k[i]);
        }
        __setModuleDefault(result, mod);
        return result;
    };
}();
var __read = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__read || function(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while((n === void 0 || n-- > 0) && !(r = i.next()).done)ar.push(r.value);
    } catch (error) {
        e = {
            error: error
        };
    } finally{
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        } finally{
            if (e) throw e.error;
        }
    }
    return ar;
};
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.DateTime = exports.LocalDateTime = exports.Date = exports.Time = exports.LocalTime = exports.Duration = void 0;
exports.isDuration = isDuration;
exports.isLocalTime = isLocalTime;
exports.isTime = isTime;
exports.isDate = isDate;
exports.isLocalDateTime = isLocalDateTime;
exports.isDateTime = isDateTime;
var util = __importStar(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/internal/temporal-util.js [app-route] (ecmascript)"));
var util_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/internal/util.js [app-route] (ecmascript)");
var error_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/error.js [app-route] (ecmascript)");
var integer_1 = __importStar(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/integer.js [app-route] (ecmascript)"));
var IDENTIFIER_PROPERTY_ATTRIBUTES = {
    value: true,
    enumerable: false,
    configurable: false,
    writable: false
};
var DURATION_IDENTIFIER_PROPERTY = '__isDuration__';
var LOCAL_TIME_IDENTIFIER_PROPERTY = '__isLocalTime__';
var TIME_IDENTIFIER_PROPERTY = '__isTime__';
var DATE_IDENTIFIER_PROPERTY = '__isDate__';
var LOCAL_DATE_TIME_IDENTIFIER_PROPERTY = '__isLocalDateTime__';
var DATE_TIME_IDENTIFIER_PROPERTY = '__isDateTime__';
/**
 * Represents an ISO 8601 duration. Contains both date-based values (years, months, days) and time-based values (seconds, nanoseconds).
 * Created `Duration` objects are frozen with `Object.freeze()` in constructor and thus immutable.
 */ var Duration = function() {
    /**
     * @constructor
     * @param {NumberOrInteger} months - The number of months for the new duration.
     * @param {NumberOrInteger} days - The number of days for the new duration.
     * @param {NumberOrInteger} seconds - The number of seconds for the new duration.
     * @param {NumberOrInteger} nanoseconds - The number of nanoseconds for the new duration.
     */ function Duration(months, days, seconds, nanoseconds) {
        /**
         * The number of months.
         * @type {NumberOrInteger}
         */ this.months = (0, util_1.assertNumberOrInteger)(months, 'Months');
        /**
         * The number of days.
         * @type {NumberOrInteger}
         */ this.days = (0, util_1.assertNumberOrInteger)(days, 'Days');
        (0, util_1.assertNumberOrInteger)(seconds, 'Seconds');
        (0, util_1.assertNumberOrInteger)(nanoseconds, 'Nanoseconds');
        /**
         * The number of seconds.
         * @type {NumberOrInteger}
         */ this.seconds = util.normalizeSecondsForDuration(seconds, nanoseconds);
        if (typeof seconds === 'number' && (0, integer_1.isInt)(this.seconds)) {
            this.seconds = this.seconds.toNumber();
        }
        if (typeof seconds === 'bigint' && (0, integer_1.isInt)(this.seconds)) {
            this.seconds = this.seconds.toBigInt();
        }
        /**
         * The number of nanoseconds.
         * @type {NumberOrInteger}
         */ this.nanoseconds = util.normalizeNanosecondsForDuration(nanoseconds);
        if (typeof nanoseconds === 'number' && (0, integer_1.isInt)(this.nanoseconds)) {
            this.nanoseconds = this.nanoseconds.toNumber();
        }
        if (typeof nanoseconds === 'bigint' && (0, integer_1.isInt)(this.nanoseconds)) {
            this.nanoseconds = this.nanoseconds.toBigInt();
        }
        Object.freeze(this);
    }
    /**
     * @ignore
     */ Duration.prototype.toString = function() {
        return util.durationToIsoString(this.months, this.days, this.seconds, this.nanoseconds);
    };
    return Duration;
}();
exports.Duration = Duration;
Object.defineProperty(Duration.prototype, DURATION_IDENTIFIER_PROPERTY, IDENTIFIER_PROPERTY_ATTRIBUTES);
/**
 * Test if given object is an instance of {@link Duration} class.
 * @param {Object} obj the object to test.
 * @return {boolean} `true` if given object is a {@link Duration}, `false` otherwise.
 */ function isDuration(obj) {
    return hasIdentifierProperty(obj, DURATION_IDENTIFIER_PROPERTY);
}
/**
 * Represents an instant capturing the time of day, but not the date, nor the timezone.
 * Created {@link LocalTime} objects are frozen with `Object.freeze()` in constructor and thus immutable.
 */ var LocalTime = function() {
    /**
     * @constructor
     * @param {NumberOrInteger} hour - The hour for the new local time.
     * @param {NumberOrInteger} minute - The minute for the new local time.
     * @param {NumberOrInteger} second - The second for the new local time.
     * @param {NumberOrInteger} nanosecond - The nanosecond for the new local time.
     */ function LocalTime(hour, minute, second, nanosecond) {
        /**
         * The hour.
         * @type {NumberOrInteger}
         */ this.hour = util.assertValidHour(hour);
        /**
         * The minute.
         * @type {NumberOrInteger}
         */ this.minute = util.assertValidMinute(minute);
        /**
         * The second.
         * @type {NumberOrInteger}
         */ this.second = util.assertValidSecond(second);
        /**
         * The nanosecond.
         * @type {NumberOrInteger}
         */ this.nanosecond = util.assertValidNanosecond(nanosecond);
        Object.freeze(this);
    }
    /**
     * Create a {@link LocalTime} object from the given standard JavaScript `Date` and optional nanoseconds.
     * Year, month, day and time zone offset components of the given date are ignored.
     * @param {global.Date} standardDate - The standard JavaScript date to convert.
     * @param {NumberOrInteger|undefined} nanosecond - The optional amount of nanoseconds.
     * @return {LocalTime<number>} New LocalTime.
     */ LocalTime.fromStandardDate = function(standardDate, nanosecond) {
        verifyStandardDateAndNanos(standardDate, nanosecond);
        var totalNanoseconds = util.totalNanoseconds(standardDate, nanosecond);
        return new LocalTime(standardDate.getHours(), standardDate.getMinutes(), standardDate.getSeconds(), totalNanoseconds instanceof integer_1.default ? totalNanoseconds.toInt() : typeof totalNanoseconds === 'bigint' ? (0, integer_1.int)(totalNanoseconds).toInt() : totalNanoseconds);
    };
    /**
     * @ignore
     */ LocalTime.prototype.toString = function() {
        return util.timeToIsoString(this.hour, this.minute, this.second, this.nanosecond);
    };
    return LocalTime;
}();
exports.LocalTime = LocalTime;
Object.defineProperty(LocalTime.prototype, LOCAL_TIME_IDENTIFIER_PROPERTY, IDENTIFIER_PROPERTY_ATTRIBUTES);
/**
 * Test if given object is an instance of {@link LocalTime} class.
 * @param {Object} obj the object to test.
 * @return {boolean} `true` if given object is a {@link LocalTime}, `false` otherwise.
 */ function isLocalTime(obj) {
    return hasIdentifierProperty(obj, LOCAL_TIME_IDENTIFIER_PROPERTY);
}
/**
 * Represents an instant capturing the time of day, and the timezone offset in seconds, but not the date.
 * Created {@link Time} objects are frozen with `Object.freeze()` in constructor and thus immutable.
 */ var Time = function() {
    /**
     * @constructor
     * @param {NumberOrInteger} hour - The hour for the new local time.
     * @param {NumberOrInteger} minute - The minute for the new local time.
     * @param {NumberOrInteger} second - The second for the new local time.
     * @param {NumberOrInteger} nanosecond - The nanosecond for the new local time.
     * @param {NumberOrInteger} timeZoneOffsetSeconds - The time zone offset in seconds. Value represents the difference, in seconds, from UTC to local time.
     * This is different from standard JavaScript `Date.getTimezoneOffset()` which is the difference, in minutes, from local time to UTC.
     */ function Time(hour, minute, second, nanosecond, timeZoneOffsetSeconds) {
        /**
         * The hour.
         * @type {NumberOrInteger}
         */ this.hour = util.assertValidHour(hour);
        /**
         * The minute.
         * @type {NumberOrInteger}
         */ this.minute = util.assertValidMinute(minute);
        /**
         * The second.
         * @type {NumberOrInteger}
         */ this.second = util.assertValidSecond(second);
        /**
         * The nanosecond.
         * @type {NumberOrInteger}
         */ this.nanosecond = util.assertValidNanosecond(nanosecond);
        /**
         * The time zone offset in seconds.
         * @type {NumberOrInteger}
         */ this.timeZoneOffsetSeconds = (0, util_1.assertNumberOrInteger)(timeZoneOffsetSeconds, 'Time zone offset in seconds');
        Object.freeze(this);
    }
    /**
     * Create a {@link Time} object from the given standard JavaScript `Date` and optional nanoseconds.
     * Year, month and day components of the given date are ignored.
     * @param {global.Date} standardDate - The standard JavaScript date to convert.
     * @param {NumberOrInteger|undefined} nanosecond - The optional amount of nanoseconds.
     * @return {Time<number>} New Time.
     */ Time.fromStandardDate = function(standardDate, nanosecond) {
        verifyStandardDateAndNanos(standardDate, nanosecond);
        return new Time(standardDate.getHours(), standardDate.getMinutes(), standardDate.getSeconds(), (0, integer_1.toNumber)(util.totalNanoseconds(standardDate, nanosecond)), util.timeZoneOffsetInSeconds(standardDate));
    };
    /**
     * @ignore
     */ Time.prototype.toString = function() {
        return util.timeToIsoString(this.hour, this.minute, this.second, this.nanosecond) + util.timeZoneOffsetToIsoString(this.timeZoneOffsetSeconds);
    };
    return Time;
}();
exports.Time = Time;
Object.defineProperty(Time.prototype, TIME_IDENTIFIER_PROPERTY, IDENTIFIER_PROPERTY_ATTRIBUTES);
/**
 * Test if given object is an instance of {@link Time} class.
 * @param {Object} obj the object to test.
 * @return {boolean} `true` if given object is a {@link Time}, `false` otherwise.
 */ function isTime(obj) {
    return hasIdentifierProperty(obj, TIME_IDENTIFIER_PROPERTY);
}
/**
 * Represents an instant capturing the date, but not the time, nor the timezone.
 * Created {@link Date} objects are frozen with `Object.freeze()` in constructor and thus immutable.
 */ var Date = function() {
    /**
     * @constructor
     * @param {NumberOrInteger} year - The year for the new local date.
     * @param {NumberOrInteger} month - The month for the new local date.
     * @param {NumberOrInteger} day - The day for the new local date.
     */ function Date(year, month, day) {
        /**
         * The year.
         * @type {NumberOrInteger}
         */ this.year = util.assertValidYear(year);
        /**
         * The month.
         * @type {NumberOrInteger}
         */ this.month = util.assertValidMonth(month);
        /**
         * The day.
         * @type {NumberOrInteger}
         */ this.day = util.assertValidDay(day);
        Object.freeze(this);
    }
    /**
     * Create a {@link Date} object from the given standard JavaScript `Date`.
     * Hour, minute, second and millisecond components of the given date are ignored.
     *
     * NOTE: the function {@link toStandardDate} and {@link fromStandardDate} are not inverses of one another. {@link fromStandardDate} takes the Day, Month and Year in local time from the supplied JavaScript Date object, while {@link toStandardDate} creates a new JavaScript Date object at midnight UTC.
     *
     * @param {global.Date} standardDate - The standard JavaScript date to convert.
     * @return {Date} New Date.
     * @deprecated use {@link fromStandardDateLocal} which is a drop in replacement, or {@link fromStandardDateUTC} which takes the Year, Month and Date from UTC rather than Local time
     */ Date.fromStandardDate = function(standardDate) {
        return this.fromStandardDateLocal(standardDate);
    };
    /**
     * Create a {@link Date} object from the given standard JavaScript `Date` using the Year, Month and Date in Local Time.
     * Hour, minute, second and millisecond components of the given date are ignored.
     *
     * NOTE: this function and {@link toStandardDate} are not inverses of one another.
     * This takes the Day, Month and Year in local time from the supplied JavaScript Date object, while {@link toStandardDate} creates a new JavaScript Date object at midnight UTC.
     * For a more global approach, use {@link fromStandardDateUTC}, which reads the date in UTC time.
     *
     * @example
     * fromStandardDateLocal(new Date("2010-10-10T00:00:00")) // Will create a date at 2010-10-10 as JS Dates are created at local time by default
     * fromStandardDateLocal(new Date("2010-10-10T00:00:00Z")) // This may cause issues as this date is created at UTC with the trailing "Z"
     *
     * @param {global.Date} standardDate - The standard JavaScript date to convert.
     * @return {Date} New Date.
     */ Date.fromStandardDateLocal = function(standardDate) {
        verifyStandardDateAndNanos(standardDate);
        return new Date(standardDate.getFullYear(), standardDate.getMonth() + 1, standardDate.getDate());
    };
    /**
     * Create a {@link Date} object from the given standard JavaScript `Date` using the Year, Month and Date in UTC time.
     * Hour, minute, second and millisecond components of the given date are ignored.
     *
     * @example
     * fromStandardDateUTC(new Date("2010-10-10T00:00:00")) // This may cause issues as JS Dates are created at local time by default
     * fromStandardDateUTC(new Date("2010-10-10T00:00:00Z")) // Will create a date at 2010-10-10 as this date is created at UTC with the trailing "Z"
     *
     * @param {global.Date} standardDate - The standard JavaScript date to convert.
     * @return {Date} New Date.
     */ Date.fromStandardDateUTC = function(standardDate) {
        verifyStandardDateAndNanos(standardDate);
        return new Date(standardDate.getUTCFullYear(), standardDate.getUTCMonth() + 1, standardDate.getUTCDate());
    };
    /**
     * Convert date to standard JavaScript `Date`.
     *
     * The time component of the returned `Date` is set to midnight
     * and the time zone is set to UTC.
     *
     * @returns {StandardDate} Standard JavaScript `Date` at `00:00:00.000` UTC.
     */ Date.prototype.toStandardDate = function() {
        return util.isoStringToStandardDate(this.toString());
    };
    /**
     * @ignore
     */ Date.prototype.toString = function() {
        return util.dateToIsoString(this.year, this.month, this.day);
    };
    return Date;
}();
exports.Date = Date;
Object.defineProperty(Date.prototype, DATE_IDENTIFIER_PROPERTY, IDENTIFIER_PROPERTY_ATTRIBUTES);
/**
 * Test if given object is an instance of {@link Date} class.
 * @param {Object} obj - The object to test.
 * @return {boolean} `true` if given object is a {@link Date}, `false` otherwise.
 */ function isDate(obj) {
    return hasIdentifierProperty(obj, DATE_IDENTIFIER_PROPERTY);
}
/**
 * Represents an instant capturing the date and the time, but not the timezone.
 * Created {@link LocalDateTime} objects are frozen with `Object.freeze()` in constructor and thus immutable.
 */ var LocalDateTime = function() {
    /**
     * @constructor
     * @param {NumberOrInteger} year - The year for the new local date.
     * @param {NumberOrInteger} month - The month for the new local date.
     * @param {NumberOrInteger} day - The day for the new local date.
     * @param {NumberOrInteger} hour - The hour for the new local time.
     * @param {NumberOrInteger} minute - The minute for the new local time.
     * @param {NumberOrInteger} second - The second for the new local time.
     * @param {NumberOrInteger} nanosecond - The nanosecond for the new local time.
     */ function LocalDateTime(year, month, day, hour, minute, second, nanosecond) {
        /**
         * The year.
         * @type {NumberOrInteger}
         */ this.year = util.assertValidYear(year);
        /**
         * The month.
         * @type {NumberOrInteger}
         */ this.month = util.assertValidMonth(month);
        /**
         * The day.
         * @type {NumberOrInteger}
         */ this.day = util.assertValidDay(day);
        /**
         * The hour.
         * @type {NumberOrInteger}
         */ this.hour = util.assertValidHour(hour);
        /**
         * The minute.
         * @type {NumberOrInteger}
         */ this.minute = util.assertValidMinute(minute);
        /**
         * The second.
         * @type {NumberOrInteger}
         */ this.second = util.assertValidSecond(second);
        /**
         * The nanosecond.
         * @type {NumberOrInteger}
         */ this.nanosecond = util.assertValidNanosecond(nanosecond);
        Object.freeze(this);
    }
    /**
     * Create a {@link LocalDateTime} object from the given standard JavaScript `Date` and optional nanoseconds.
     * Time zone offset component of the given date is ignored.
     * @param {global.Date} standardDate - The standard JavaScript date to convert.
     * @param {NumberOrInteger|undefined} nanosecond - The optional amount of nanoseconds.
     * @return {LocalDateTime} New LocalDateTime.
     */ LocalDateTime.fromStandardDate = function(standardDate, nanosecond) {
        verifyStandardDateAndNanos(standardDate, nanosecond);
        return new LocalDateTime(standardDate.getFullYear(), standardDate.getMonth() + 1, standardDate.getDate(), standardDate.getHours(), standardDate.getMinutes(), standardDate.getSeconds(), (0, integer_1.toNumber)(util.totalNanoseconds(standardDate, nanosecond)));
    };
    /**
     * Convert date to standard JavaScript `Date`.
     *
     * @returns {StandardDate} Standard JavaScript `Date` at the local timezone
     */ LocalDateTime.prototype.toStandardDate = function() {
        return util.isoStringToStandardDate(this.toString());
    };
    /**
     * @ignore
     */ LocalDateTime.prototype.toString = function() {
        return localDateTimeToString(this.year, this.month, this.day, this.hour, this.minute, this.second, this.nanosecond);
    };
    return LocalDateTime;
}();
exports.LocalDateTime = LocalDateTime;
Object.defineProperty(LocalDateTime.prototype, LOCAL_DATE_TIME_IDENTIFIER_PROPERTY, IDENTIFIER_PROPERTY_ATTRIBUTES);
/**
 * Test if given object is an instance of {@link LocalDateTime} class.
 * @param {Object} obj - The object to test.
 * @return {boolean} `true` if given object is a {@link LocalDateTime}, `false` otherwise.
 */ function isLocalDateTime(obj) {
    return hasIdentifierProperty(obj, LOCAL_DATE_TIME_IDENTIFIER_PROPERTY);
}
/**
 * Represents an instant capturing the date, the time and the timezone identifier.
 * Created {@ DateTime} objects are frozen with `Object.freeze()` in constructor and thus immutable.
 */ var DateTime = function() {
    /**
     * @constructor
     * @param {NumberOrInteger} year - The year for the new date-time.
     * @param {NumberOrInteger} month - The month for the new date-time.
     * @param {NumberOrInteger} day - The day for the new date-time.
     * @param {NumberOrInteger} hour - The hour for the new date-time.
     * @param {NumberOrInteger} minute - The minute for the new date-time.
     * @param {NumberOrInteger} second - The second for the new date-time.
     * @param {NumberOrInteger} nanosecond - The nanosecond for the new date-time.
     * @param {NumberOrInteger} timeZoneOffsetSeconds - The time zone offset in seconds. Either this argument or `timeZoneId` should be defined.
     * Value represents the difference, in seconds, from UTC to local time.
     * This is different from standard JavaScript `Date.getTimezoneOffset()` which is the difference, in minutes, from local time to UTC.
     * @param {string|null} timeZoneId - The time zone id for the new date-time. Either this argument or `timeZoneOffsetSeconds` should be defined.
     */ function DateTime(year, month, day, hour, minute, second, nanosecond, timeZoneOffsetSeconds, timeZoneId) {
        /**
         * The year.
         * @type {NumberOrInteger}
         */ this.year = util.assertValidYear(year);
        /**
         * The month.
         * @type {NumberOrInteger}
         */ this.month = util.assertValidMonth(month);
        /**
         * The day.
         * @type {NumberOrInteger}
         */ this.day = util.assertValidDay(day);
        /**
         * The hour.
         * @type {NumberOrInteger}
         */ this.hour = util.assertValidHour(hour);
        /**
         * The minute.
         * @type {NumberOrInteger}
         */ this.minute = util.assertValidMinute(minute);
        /**
         * The second.
         * @type {NumberOrInteger}
         */ this.second = util.assertValidSecond(second);
        /**
         * The nanosecond.
         * @type {NumberOrInteger}
         */ this.nanosecond = util.assertValidNanosecond(nanosecond);
        var _a = __read(verifyTimeZoneArguments(timeZoneOffsetSeconds, timeZoneId), 2), offset = _a[0], id = _a[1];
        /**
         * The time zone offset in seconds.
         *
         * *Either this or {@link timeZoneId} is defined.*
         *
         * @type {NumberOrInteger}
         */ this.timeZoneOffsetSeconds = offset;
        /**
         * The time zone id.
         *
         * *Either this or {@link timeZoneOffsetSeconds} is defined.*
         *
         * @type {string}
         */ this.timeZoneId = id !== null && id !== void 0 ? id : undefined;
        Object.freeze(this);
    }
    /**
     * Create a {@link DateTime} object from the given standard JavaScript `Date` and optional nanoseconds.
     * @param {global.Date} standardDate - The standard JavaScript date to convert.
     * @param {NumberOrInteger|undefined} nanosecond - The optional amount of nanoseconds.
     * @return {DateTime} New DateTime.
     */ DateTime.fromStandardDate = function(standardDate, nanosecond) {
        verifyStandardDateAndNanos(standardDate, nanosecond);
        return new DateTime(standardDate.getFullYear(), standardDate.getMonth() + 1, standardDate.getDate(), standardDate.getHours(), standardDate.getMinutes(), standardDate.getSeconds(), (0, integer_1.toNumber)(util.totalNanoseconds(standardDate, nanosecond)), util.timeZoneOffsetInSeconds(standardDate), null);
    };
    /**
     * Convert date to standard JavaScript `Date`.
     *
     * @returns {StandardDate} Standard JavaScript `Date` at the defined time zone offset
     * @throws {Error} If the time zone offset is not defined in the object.
     */ DateTime.prototype.toStandardDate = function() {
        return util.toStandardDate(this._toUTC());
    };
    /**
     * @ignore
     */ DateTime.prototype.toString = function() {
        var _a;
        var localDateTimeStr = localDateTimeToString(this.year, this.month, this.day, this.hour, this.minute, this.second, this.nanosecond);
        var timeOffset = this.timeZoneOffsetSeconds != null ? util.timeZoneOffsetToIsoString((_a = this.timeZoneOffsetSeconds) !== null && _a !== void 0 ? _a : 0) : '';
        var timeZoneStr = this.timeZoneId != null ? "[".concat(this.timeZoneId, "]") : '';
        return localDateTimeStr + timeOffset + timeZoneStr;
    };
    /**
     * @private
     * @returns {number}
     */ DateTime.prototype._toUTC = function() {
        var _a;
        if (this.timeZoneOffsetSeconds === undefined) {
            throw new Error('Requires DateTime created with time zone offset');
        }
        var epochSecond = util.localDateTimeToEpochSecond(this.year, this.month, this.day, this.hour, this.minute, this.second, this.nanosecond);
        var utcSecond = epochSecond.subtract((_a = this.timeZoneOffsetSeconds) !== null && _a !== void 0 ? _a : 0);
        return (0, integer_1.int)(utcSecond).multiply(1000).add((0, integer_1.int)(this.nanosecond).div(1000000)).toNumber();
    };
    return DateTime;
}();
exports.DateTime = DateTime;
Object.defineProperty(DateTime.prototype, DATE_TIME_IDENTIFIER_PROPERTY, IDENTIFIER_PROPERTY_ATTRIBUTES);
/**
 * Test if given object is an instance of {@link DateTime} class.
 * @param {Object} obj - The object to test.
 * @return {boolean} `true` if given object is a {@link DateTime}, `false` otherwise.
 */ function isDateTime(obj) {
    return hasIdentifierProperty(obj, DATE_TIME_IDENTIFIER_PROPERTY);
}
function hasIdentifierProperty(obj, property) {
    return obj != null && obj[property] === true;
}
function localDateTimeToString(year, month, day, hour, minute, second, nanosecond) {
    return util.dateToIsoString(year, month, day) + 'T' + util.timeToIsoString(hour, minute, second, nanosecond);
}
/**
 * @private
 * @param {NumberOrInteger} timeZoneOffsetSeconds
 * @param {string | null } timeZoneId
 * @returns {Array<NumberOrInteger | undefined | null, string | undefined | null>}
 */ function verifyTimeZoneArguments(timeZoneOffsetSeconds, timeZoneId) {
    var offsetDefined = timeZoneOffsetSeconds !== null && timeZoneOffsetSeconds !== undefined;
    var idDefined = timeZoneId !== null && timeZoneId !== undefined && timeZoneId !== '';
    if (!offsetDefined && !idDefined) {
        throw (0, error_1.newError)(// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        "Unable to create DateTime without either time zone offset or id. Please specify either of them. Given offset: ".concat(timeZoneOffsetSeconds, " and id: ").concat(timeZoneId));
    }
    var result = [
        undefined,
        undefined
    ];
    if (offsetDefined) {
        (0, util_1.assertNumberOrInteger)(timeZoneOffsetSeconds, 'Time zone offset in seconds');
        result[0] = timeZoneOffsetSeconds;
    }
    if (idDefined) {
        (0, util_1.assertString)(timeZoneId, 'Time zone ID');
        util.assertValidZoneId('Time zone ID', timeZoneId);
        result[1] = timeZoneId;
    }
    return result;
}
/**
 * @private
 * @param {StandardDate} standardDate
 * @param {NumberOrInteger} nanosecond
 * @returns {void}
 */ function verifyStandardDateAndNanos(standardDate, nanosecond) {
    (0, util_1.assertValidDate)(standardDate, 'Standard date');
    if (nanosecond !== null && nanosecond !== undefined) {
        (0, util_1.assertNumberOrInteger)(nanosecond, 'Nanosecond');
    }
}
}),
"[project]/frontend/node_modules/neo4j-driver-core/lib/mapping.nameconventions.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/**
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 *
 * This file is part of Neo4j.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ var __values = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__values || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function() {
            if (o && i >= o.length) o = void 0;
            return {
                value: o && o[i++],
                done: !o
            };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __read = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__read || function(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while((n === void 0 || n-- > 0) && !(r = i.next()).done)ar.push(r.value);
    } catch (error) {
        e = {
            error: error
        };
    } finally{
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        } finally{
            if (e) throw e.error;
        }
    }
    return ar;
};
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.nameConventions = exports.StandardCase = void 0;
var StandardCase;
(function(StandardCase) {
    StandardCase["SnakeCase"] = "snake_case";
    StandardCase["KebabCase"] = "kebab-case";
    StandardCase["ScreamingSnakeCase"] = "SCREAMING_SNAKE_CASE";
    StandardCase["PascalCase"] = "PascalCase";
    StandardCase["CamelCase"] = "camelCase";
})(StandardCase || (exports.StandardCase = StandardCase = {}));
exports.nameConventions = {
    snake_case: {
        tokenize: function(name) {
            return name.split('_');
        },
        encode: function(tokens) {
            return tokens.join('_');
        }
    },
    'kebab-case': {
        tokenize: function(name) {
            return name.split('-');
        },
        encode: function(tokens) {
            return tokens.join('-');
        }
    },
    PascalCase: {
        tokenize: function(name) {
            return name.split(/(?=[A-Z])/).map(function(token) {
                return token.toLowerCase();
            });
        },
        encode: function(tokens) {
            var e_1, _a;
            var name = '';
            try {
                for(var tokens_1 = __values(tokens), tokens_1_1 = tokens_1.next(); !tokens_1_1.done; tokens_1_1 = tokens_1.next()){
                    var token = tokens_1_1.value;
                    token = token.charAt(0).toUpperCase() + token.slice(1);
                    name += token;
                }
            } catch (e_1_1) {
                e_1 = {
                    error: e_1_1
                };
            } finally{
                try {
                    if (tokens_1_1 && !tokens_1_1.done && (_a = tokens_1.return)) _a.call(tokens_1);
                } finally{
                    if (e_1) throw e_1.error;
                }
            }
            return name;
        }
    },
    camelCase: {
        tokenize: function(name) {
            return name.split(/(?=[A-Z])/).map(function(token) {
                return token.toLowerCase();
            });
        },
        encode: function(tokens) {
            var e_2, _a;
            var name = '';
            try {
                for(var _b = __values(tokens.entries()), _c = _b.next(); !_c.done; _c = _b.next()){
                    var _d = __read(_c.value, 2), i = _d[0], token = _d[1];
                    if (i !== 0) {
                        token = token.charAt(0).toUpperCase() + token.slice(1);
                    }
                    name += token;
                }
            } catch (e_2_1) {
                e_2 = {
                    error: e_2_1
                };
            } finally{
                try {
                    if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                } finally{
                    if (e_2) throw e_2.error;
                }
            }
            return name;
        }
    },
    SCREAMING_SNAKE_CASE: {
        tokenize: function(name) {
            return name.split('_').map(function(token) {
                return token.toLowerCase();
            });
        },
        encode: function(tokens) {
            return tokens.join('_').toUpperCase();
        }
    }
};
}),
"[project]/frontend/node_modules/neo4j-driver-core/lib/mapping.highlevel.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/**
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 *
 * This file is part of Neo4j.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ var __values = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__values || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function() {
            if (o && i >= o.length) o = void 0;
            return {
                value: o && o[i++],
                done: !o
            };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __read = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__read || function(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while((n === void 0 || n-- > 0) && !(r = i.next()).done)ar.push(r.value);
    } catch (error) {
        e = {
            error: error
        };
    } finally{
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        } finally{
            if (e) throw e.error;
        }
    }
    return ar;
};
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.RecordObjectMapping = exports.rulesRegistry = void 0;
exports.as = as;
exports.valueAs = valueAs;
var error_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/error.js [app-route] (ecmascript)");
var mapping_nameconventions_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/mapping.nameconventions.js [app-route] (ecmascript)");
exports.rulesRegistry = {};
var nameMapping = function(name) {
    return name;
};
function register(constructor, rules) {
    exports.rulesRegistry[constructor.name] = rules;
}
function clearMappingRegistry() {
    exports.rulesRegistry = {};
}
function translateIdentifiers(translationFunction) {
    nameMapping = translationFunction;
}
function getCaseTranslator(databaseConvention, codeConvention) {
    var keys = Object.keys(mapping_nameconventions_1.nameConventions);
    if (!keys.includes(databaseConvention)) {
        throw (0, error_1.newError)("Naming convention ".concat(databaseConvention, " is not recognized, \n      please provide a recognized name convention or manually provide a translation function."));
    }
    if (!keys.includes(codeConvention)) {
        throw (0, error_1.newError)("Naming convention ".concat(codeConvention, " is not recognized, \n      please provide a recognized name convention or manually provide a translation function."));
    }
    // @ts-expect-error
    return function(name) {
        return mapping_nameconventions_1.nameConventions[databaseConvention].encode(mapping_nameconventions_1.nameConventions[codeConvention].tokenize(name));
    };
}
exports.RecordObjectMapping = Object.freeze({
    /**
   * Clears all registered type mappings from the record object mapping registry.
   * @experimental Part of the Record Object Mapping preview feature
   */ clearMappingRegistry: clearMappingRegistry,
    /**
   * Creates a translation function from record key names to object property names, for use with the {@link translateIdentifiers} function
   *
   * Recognized naming conventions are "camelCase", "PascalCase", "snake_case", "kebab-case", "SCREAMING_SNAKE_CASE"
   *
   * @experimental Part of the Record Object Mapping preview feature
   * @param {string} databaseConvention The naming convention in use in database result Records
   * @param {string} codeConvention The naming convention in use in JavaScript object properties
   * @returns {function} translation function
   */ getCaseTranslator: getCaseTranslator,
    /**
   * Registers a set of {@link Rules} to be used by {@link hydrated} for the provided class when no other rules are specified. This registry exists in global memory, not the driver instance.
   *
   * @example
   * // The following code:
   * const summary = await driver.executeQuery('CREATE (p:Person{ name: $name }) RETURN p', { name: 'Person1'}, {
   *  resultTransformer: neo4j.resultTransformers.hydrated(Person, personClassRules)
   * })
   *
   * can instead be written:
   * neo4j.RecordObjectMapping.register(Person, personClassRules)
   *
   * const summary = await driver.executeQuery('CREATE (p:Person{ name: $name }) RETURN p', { name: 'Person1'}, {
   *  resultTransformer: neo4j.resultTransformers.hydrated(Person)
   * })
   *
   * @experimental Part of the Record Object Mapping preview feature
   * @param {GenericConstructor} constructor The constructor function of the class to set rules for
   * @param {Rules} rules The rules to set for the provided class
   */ register: register,
    /**
   * Sets a default name translation from record keys to object properties.
   * If providing a function, provide a function that maps FROM your object properties names TO record key names.
   *
   * The function getCaseTranslator can be used to provide a prewritten translation function between some common naming conventions.
   *
   * @example
   * //if the keys on records from the database are in ALLCAPS
   * RecordObjectMapping.translateIdentifiers((name) => name.toUpperCase())
   *
   * //if you utilize PacalCase in the database and camelCase in JavaScript code.
   * RecordObjectMapping.translateIdentifiers(mapping.getCaseTranslator("PascalCase", "camelCase"))
   *
   * //if a type has one odd mapping you can override the translation with the rule
   * const personRules = {
   *  firstName: neo4j.rule.asString(),
   *  bornAt: neo4j.rule.asNumber({ acceptBigInt: true, optional: true })
   *  weird_name-property: neo4j.rule.asString({from: 'homeTown'})
   * }
   * //These rules can then be used by providing them to a hydratedResultsMapper
   * record.as<Person>(personRules)
   * //or by registering them to the mapping registry
   * RecordObjectMapping.register(Person, personRules)
   *
   * @experimental Part of the Record Object Mapping preview feature
   * @param {function} translationFunction A function translating the names of your JS object property names to record key names
   */ translateIdentifiers: translateIdentifiers
});
function as(gettable, constructorOrRules, rules) {
    var e_1, _a, e_2, _b;
    var GenericConstructor = typeof constructorOrRules === 'function' ? constructorOrRules : Object;
    var theRules = getRules(constructorOrRules, rules);
    var visitedKeys = [];
    var obj = new GenericConstructor();
    try {
        for(var _c = __values(Object.entries(theRules !== null && theRules !== void 0 ? theRules : {})), _d = _c.next(); !_d.done; _d = _c.next()){
            var _e = __read(_d.value, 2), key = _e[0], rule = _e[1];
            visitedKeys.push(key);
            _apply(gettable, obj, key, rule);
        }
    } catch (e_1_1) {
        e_1 = {
            error: e_1_1
        };
    } finally{
        try {
            if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
        } finally{
            if (e_1) throw e_1.error;
        }
    }
    try {
        for(var _f = __values(Object.getOwnPropertyNames(obj)), _g = _f.next(); !_g.done; _g = _f.next()){
            var key = _g.value;
            if (!visitedKeys.includes(key)) {
                _apply(gettable, obj, key, theRules === null || theRules === void 0 ? void 0 : theRules[key]);
            }
        }
    } catch (e_2_1) {
        e_2 = {
            error: e_2_1
        };
    } finally{
        try {
            if (_g && !_g.done && (_b = _f.return)) _b.call(_f);
        } finally{
            if (e_2) throw e_2.error;
        }
    }
    return obj;
}
function _apply(gettable, obj, key, rule) {
    var _a;
    var mappedkey = nameMapping(key);
    var value = gettable.get((_a = rule === null || rule === void 0 ? void 0 : rule.from) !== null && _a !== void 0 ? _a : mappedkey);
    var field = "".concat(obj.constructor.name, "#").concat(key);
    var processedValue = valueAs(value, field, rule);
    // @ts-expect-error
    obj[key] = processedValue !== null && processedValue !== void 0 ? processedValue : obj[key];
}
function valueAs(value, field, rule) {
    if ((rule === null || rule === void 0 ? void 0 : rule.optional) === true && value == null) {
        return value;
    }
    if (typeof (rule === null || rule === void 0 ? void 0 : rule.validate) === 'function') {
        rule.validate(value, field);
    }
    return (rule === null || rule === void 0 ? void 0 : rule.convert) != null ? rule.convert(value, field) : value;
}
function getRules(constructorOrRules, rules) {
    var rulesDefined = typeof constructorOrRules === 'object' ? constructorOrRules : rules;
    if (rulesDefined != null) {
        return rulesDefined;
    }
    return typeof constructorOrRules !== 'object' ? exports.rulesRegistry[constructorOrRules.name] : undefined;
}
}),
"[project]/frontend/node_modules/neo4j-driver-core/lib/graph-types.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.PathSegment = exports.Path = exports.UnboundRelationship = exports.Relationship = exports.Node = void 0;
exports.isNode = isNode;
exports.isRelationship = isRelationship;
exports.isUnboundRelationship = isUnboundRelationship;
exports.isPath = isPath;
exports.isPathSegment = isPathSegment;
var json_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/json.js [app-route] (ecmascript)");
var mapping_highlevel_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/mapping.highlevel.js [app-route] (ecmascript)");
var IDENTIFIER_PROPERTY_ATTRIBUTES = {
    value: true,
    enumerable: false,
    configurable: false,
    writable: false
};
var NODE_IDENTIFIER_PROPERTY = '__isNode__';
var RELATIONSHIP_IDENTIFIER_PROPERTY = '__isRelationship__';
var UNBOUND_RELATIONSHIP_IDENTIFIER_PROPERTY = '__isUnboundRelationship__';
var PATH_IDENTIFIER_PROPERTY = '__isPath__';
var PATH_SEGMENT_IDENTIFIER_PROPERTY = '__isPathSegment__';
function hasIdentifierProperty(obj, property) {
    return obj != null && obj[property] === true;
}
/**
 * Class for Node Type.
 */ var Node = function() {
    /**
     * @constructor
     * @protected
     * @param {NumberOrInteger} identity - Unique identity
     * @param {Array<string>} labels - Array for all labels
     * @param {Properties} properties - Map with node properties
     * @param {string} elementId - Node element identifier
     */ function Node(identity, labels, properties, elementId) {
        /**
         * Identity of the node.
         * @type {NumberOrInteger}
         * @deprecated use {@link Node#elementId} instead
         */ this.identity = identity;
        /**
         * Labels of the node.
         * @type {string[]}
         */ this.labels = labels;
        /**
         * Properties of the node.
         * @type {Properties}
         */ this.properties = properties;
        /**
         * The Node element identifier.
         * @type {string}
         */ this.elementId = _valueOrGetDefault(elementId, function() {
            return identity.toString();
        });
    }
    Node.prototype.as = function(constructorOrRules, rules) {
        var _this = this;
        return (0, mapping_highlevel_1.as)({
            get: function(key) {
                return _this.properties[key];
            }
        }, constructorOrRules, rules);
    };
    /**
     * @ignore
     */ Node.prototype.toString = function() {
        var s = '(' + this.elementId;
        for(var i = 0; i < this.labels.length; i++){
            s += ':' + this.labels[i];
        }
        var keys = Object.keys(this.properties);
        if (keys.length > 0) {
            s += ' {';
            for(var i = 0; i < keys.length; i++){
                if (i > 0) s += ',';
                s += keys[i] + ':' + (0, json_1.stringify)(this.properties[keys[i]]);
            }
            s += '}';
        }
        s += ')';
        return s;
    };
    return Node;
}();
exports.Node = Node;
Object.defineProperty(Node.prototype, NODE_IDENTIFIER_PROPERTY, IDENTIFIER_PROPERTY_ATTRIBUTES);
/**
 * Test if given object is an instance of {@link Node} class.
 * @param {Object} obj the object to test.
 * @return {boolean} `true` if given object is a {@link Node}, `false` otherwise.
 */ function isNode(obj) {
    return hasIdentifierProperty(obj, NODE_IDENTIFIER_PROPERTY);
}
/**
 * Class for Relationship Type.
 */ var Relationship = function() {
    /**
     * @constructor
     * @protected
     * @param {NumberOrInteger} identity - Unique identity
     * @param {NumberOrInteger} start - Identity of start Node
     * @param {NumberOrInteger} end - Identity of end Node
     * @param {string} type - Relationship type
     * @param {Properties} properties - Map with relationship properties
     * @param {string} elementId - Relationship element identifier
     * @param {string} startNodeElementId - Start Node element identifier
     * @param {string} endNodeElementId - End Node element identifier
     */ function Relationship(identity, start, end, type, properties, elementId, startNodeElementId, endNodeElementId) {
        /**
         * Identity of the relationship.
         * @type {NumberOrInteger}
         * @deprecated use {@link Relationship#elementId} instead
         */ this.identity = identity;
        /**
         * Identity of the start node.
         * @type {NumberOrInteger}
         * @deprecated use {@link Relationship#startNodeElementId} instead
         */ this.start = start;
        /**
         * Identity of the end node.
         * @type {NumberOrInteger}
         * @deprecated use {@link Relationship#endNodeElementId} instead
         */ this.end = end;
        /**
         * Type of the relationship.
         * @type {string}
         */ this.type = type;
        /**
         * Properties of the relationship.
         * @type {Properties}
         */ this.properties = properties;
        /**
         * The Relationship element identifier.
         * @type {string}
         */ this.elementId = _valueOrGetDefault(elementId, function() {
            return identity.toString();
        });
        /**
         * The Start Node element identifier.
         * @type {string}
         */ this.startNodeElementId = _valueOrGetDefault(startNodeElementId, function() {
            return start.toString();
        });
        /**
         * The End Node element identifier.
         * @type {string}
         */ this.endNodeElementId = _valueOrGetDefault(endNodeElementId, function() {
            return end.toString();
        });
    }
    Relationship.prototype.as = function(constructorOrRules, rules) {
        var _this = this;
        return (0, mapping_highlevel_1.as)({
            get: function(key) {
                return _this.properties[key];
            }
        }, constructorOrRules, rules);
    };
    /**
     * @ignore
     */ Relationship.prototype.toString = function() {
        var s = '(' + this.startNodeElementId + ')-[:' + this.type;
        var keys = Object.keys(this.properties);
        if (keys.length > 0) {
            s += ' {';
            for(var i = 0; i < keys.length; i++){
                if (i > 0) s += ',';
                s += keys[i] + ':' + (0, json_1.stringify)(this.properties[keys[i]]);
            }
            s += '}';
        }
        s += ']->(' + this.endNodeElementId + ')';
        return s;
    };
    return Relationship;
}();
exports.Relationship = Relationship;
Object.defineProperty(Relationship.prototype, RELATIONSHIP_IDENTIFIER_PROPERTY, IDENTIFIER_PROPERTY_ATTRIBUTES);
/**
 * Test if given object is an instance of {@link Relationship} class.
 * @param {Object} obj the object to test.
 * @return {boolean} `true` if given object is a {@link Relationship}, `false` otherwise.
 */ function isRelationship(obj) {
    return hasIdentifierProperty(obj, RELATIONSHIP_IDENTIFIER_PROPERTY);
}
/**
 * Class for UnboundRelationship Type.
 * @access private
 */ var UnboundRelationship = function() {
    /**
     * @constructor
     * @protected
     * @param {NumberOrInteger} identity - Unique identity
     * @param {string} type - Relationship type
     * @param {Properties} properties - Map with relationship properties
     * @param {string} elementId - Relationship element identifier
     */ function UnboundRelationship(identity, type, properties, elementId) {
        /**
         * Identity of the relationship.
         * @type {NumberOrInteger}
         * @deprecated use {@link UnboundRelationship#elementId} instead
         */ this.identity = identity;
        /**
         * Type of the relationship.
         * @type {string}
         */ this.type = type;
        /**
         * Properties of the relationship.
         * @type {Properties}
         */ this.properties = properties;
        /**
         * The Relationship element identifier.
         * @type {string}
         */ this.elementId = _valueOrGetDefault(elementId, function() {
            return identity.toString();
        });
    }
    /**
     * Bind relationship
     *
     * @protected
     * @deprecated use {@link UnboundRelationship#bindTo} instead
     * @param {Integer} start - Identity of start node
     * @param {Integer} end - Identity of end node
     * @return {Relationship} - Created relationship
     */ UnboundRelationship.prototype.bind = function(start, end) {
        return new Relationship(this.identity, start, end, this.type, this.properties, this.elementId);
    };
    /**
     * Bind relationship
     *
     * @protected
     * @param {Node} start - Start Node
     * @param {Node} end - End Node
     * @return {Relationship} - Created relationship
     */ UnboundRelationship.prototype.bindTo = function(start, end) {
        return new Relationship(this.identity, start.identity, end.identity, this.type, this.properties, this.elementId, start.elementId, end.elementId);
    };
    UnboundRelationship.prototype.as = function(constructorOrRules, rules) {
        var _this = this;
        return (0, mapping_highlevel_1.as)({
            get: function(key) {
                return _this.properties[key];
            }
        }, constructorOrRules, rules);
    };
    /**
     * @ignore
     */ UnboundRelationship.prototype.toString = function() {
        var s = '-[:' + this.type;
        var keys = Object.keys(this.properties);
        if (keys.length > 0) {
            s += ' {';
            for(var i = 0; i < keys.length; i++){
                if (i > 0) s += ',';
                s += keys[i] + ':' + (0, json_1.stringify)(this.properties[keys[i]]);
            }
            s += '}';
        }
        s += ']->';
        return s;
    };
    return UnboundRelationship;
}();
exports.UnboundRelationship = UnboundRelationship;
Object.defineProperty(UnboundRelationship.prototype, UNBOUND_RELATIONSHIP_IDENTIFIER_PROPERTY, IDENTIFIER_PROPERTY_ATTRIBUTES);
/**
 * Test if given object is an instance of {@link UnboundRelationship} class.
 * @param {Object} obj the object to test.
 * @return {boolean} `true` if given object is a {@link UnboundRelationship}, `false` otherwise.
 * @access private
 */ function isUnboundRelationship(obj) {
    return hasIdentifierProperty(obj, UNBOUND_RELATIONSHIP_IDENTIFIER_PROPERTY);
}
/**
 * Class for PathSegment Type.
 */ var PathSegment = function() {
    /**
     * @constructor
     * @protected
     * @param {Node} start - start node
     * @param {Relationship} rel - relationship that connects start and end node
     * @param {Node} end - end node
     */ function PathSegment(start, rel, end) {
        /**
         * Start node.
         * @type {Node}
         */ this.start = start;
        /**
         * Relationship.
         * @type {Relationship}
         */ this.relationship = rel;
        /**
         * End node.
         * @type {Node}
         */ this.end = end;
    }
    return PathSegment;
}();
exports.PathSegment = PathSegment;
Object.defineProperty(PathSegment.prototype, PATH_SEGMENT_IDENTIFIER_PROPERTY, IDENTIFIER_PROPERTY_ATTRIBUTES);
/**
 * Test if given object is an instance of {@link PathSegment} class.
 * @param {Object} obj the object to test.
 * @return {boolean} `true` if given object is a {@link PathSegment}, `false` otherwise.
 */ function isPathSegment(obj) {
    return hasIdentifierProperty(obj, PATH_SEGMENT_IDENTIFIER_PROPERTY);
}
/**
 * Class for Path Type.
 */ var Path = function() {
    /**
     * @constructor
     * @protected
     * @param {Node} start  - start node
     * @param {Node} end - end node
     * @param {Array<PathSegment>} segments - Array of Segments
     */ function Path(start, end, segments) {
        /**
         * Start node.
         * @type {Node}
         */ this.start = start;
        /**
         * End node.
         * @type {Node}
         */ this.end = end;
        /**
         * Segments.
         * @type {Array<PathSegment>}
         */ this.segments = segments;
        /**
         * Length of the segments.
         * @type {Number}
         */ this.length = segments.length;
    }
    return Path;
}();
exports.Path = Path;
Object.defineProperty(Path.prototype, PATH_IDENTIFIER_PROPERTY, IDENTIFIER_PROPERTY_ATTRIBUTES);
/**
 * Test if given object is an instance of {@link Path} class.
 * @param {Object} obj the object to test.
 * @return {boolean} `true` if given object is a {@link Path}, `false` otherwise.
 */ function isPath(obj) {
    return hasIdentifierProperty(obj, PATH_IDENTIFIER_PROPERTY);
}
function _valueOrGetDefault(value, getDefault) {
    return value === undefined || value === null ? getDefault() : value;
}
}),
"[project]/frontend/node_modules/neo4j-driver-core/lib/record.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/**
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [https://neo4j.com]
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ var __generator = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__generator || function(thisArg, body) {
    var _ = {
        label: 0,
        sent: function() {
            if (t[0] & 1) throw t[1];
            return t[1];
        },
        trys: [],
        ops: []
    }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() {
        return this;
    }), g;
    //TURBOPACK unreachable
    ;
    function verb(n) {
        return function(v) {
            return step([
                n,
                v
            ]);
        };
    }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while(g && (g = 0, op[0] && (_ = 0)), _)try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [
                op[0] & 2,
                t.value
            ];
            switch(op[0]){
                case 0:
                case 1:
                    t = op;
                    break;
                case 4:
                    _.label++;
                    return {
                        value: op[1],
                        done: false
                    };
                case 5:
                    _.label++;
                    y = op[1];
                    op = [
                        0
                    ];
                    continue;
                case 7:
                    op = _.ops.pop();
                    _.trys.pop();
                    continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                        _ = 0;
                        continue;
                    }
                    if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                        _.label = op[1];
                        break;
                    }
                    if (op[0] === 6 && _.label < t[1]) {
                        _.label = t[1];
                        t = op;
                        break;
                    }
                    if (t && _.label < t[2]) {
                        _.label = t[2];
                        _.ops.push(op);
                        break;
                    }
                    if (t[2]) _.ops.pop();
                    _.trys.pop();
                    continue;
            }
            op = body.call(thisArg, _);
        } catch (e) {
            op = [
                6,
                e
            ];
            y = 0;
        } finally{
            f = t = 0;
        }
        if (op[0] & 5) throw op[1];
        return {
            value: op[0] ? op[1] : void 0,
            done: true
        };
    }
};
var __values = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__values || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function() {
            if (o && i >= o.length) o = void 0;
            return {
                value: o && o[i++],
                done: !o
            };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __read = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__read || function(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while((n === void 0 || n-- > 0) && !(r = i.next()).done)ar.push(r.value);
    } catch (error) {
        e = {
            error: error
        };
    } finally{
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        } finally{
            if (e) throw e.error;
        }
    }
    return ar;
};
Object.defineProperty(exports, "__esModule", {
    value: true
});
var error_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/error.js [app-route] (ecmascript)");
var mapping_highlevel_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/mapping.highlevel.js [app-route] (ecmascript)");
function generateFieldLookup(keys) {
    var lookup = {};
    keys.forEach(function(name, idx) {
        lookup[name] = idx;
    });
    return lookup;
}
/**
 * Records make up the contents of the {@link Result}, and is how you access
 * the output of a query. A simple query might yield a result stream
 * with a single record, for instance:
 *
 *     MATCH (u:User) RETURN u.name, u.age
 *
 * This returns a stream of records with two fields, named `u.name` and `u.age`,
 * each record represents one user found by the query above. You can access
 * the values of each field either by name:
 *
 *     record.get("u.name")
 *
 * Or by it's position:
 *
 *     record.get(0)
 *
 * @access public
 */ var Record = function() {
    /**
     * Create a new record object.
     * @constructor
     * @protected
     * @param {string[]} keys An array of field keys, in the order the fields appear in the record
     * @param {Array} fields An array of field values
     * @param {Object} fieldLookup An object of fieldName -> value index, used to map
     *                            field names to values. If this is null, one will be
     *                            generated.
     */ function Record(keys, fields, fieldLookup) {
        /**
         * Field keys, in the order the fields appear in the record.
         * @type {string[]}
         */ this.keys = keys;
        /**
         * Number of fields
         * @type {Number}
         */ this.length = keys.length;
        this._fields = fields;
        this._fieldLookup = fieldLookup !== null && fieldLookup !== void 0 ? fieldLookup : generateFieldLookup(keys);
    }
    /**
     * Run the given function for each field in this record. The function
     * will get three arguments - the value, the key and this record, in that
     * order.
     *
     * @param {function(value: Object, key: string, record: Record)} visitor the function to apply to each field.
     * @returns {void} Nothing
     */ Record.prototype.forEach = function(visitor) {
        var e_1, _a;
        try {
            for(var _b = __values(this.entries()), _c = _b.next(); !_c.done; _c = _b.next()){
                var _d = __read(_c.value, 2), key = _d[0], value = _d[1];
                visitor(value, key, this);
            }
        } catch (e_1_1) {
            e_1 = {
                error: e_1_1
            };
        } finally{
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            } finally{
                if (e_1) throw e_1.error;
            }
        }
    };
    /**
     * Run the given function for each field in this record. The function
     * will get three arguments - the value, the key and this record, in that
     * order.
     *
     * @param {function(value: Object, key: string, record: Record)} visitor the function to apply on each field
     * and return a value that is saved to the returned Array.
     *
     * @returns {Array}
     */ Record.prototype.map = function(visitor) {
        var e_2, _a;
        var resultArray = [];
        try {
            for(var _b = __values(this.entries()), _c = _b.next(); !_c.done; _c = _b.next()){
                var _d = __read(_c.value, 2), key = _d[0], value = _d[1];
                resultArray.push(visitor(value, key, this));
            }
        } catch (e_2_1) {
            e_2 = {
                error: e_2_1
            };
        } finally{
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            } finally{
                if (e_2) throw e_2.error;
            }
        }
        return resultArray;
    };
    /**
     * Maps the record to a provided type and/or according to provided Rules.
     *
     * @param {GenericConstructor<T> | Rules} constructorOrRules
     * @param {Rules} rules
     * @returns {T}
     */ Record.prototype.as = function(constructorOrRules, rules) {
        return (0, mapping_highlevel_1.as)(this, constructorOrRules, rules);
    };
    /**
     * Iterate over results. Each iteration will yield an array
     * of exactly two items - the key, and the value (in order).
     *
     * @generator
     * @returns {IterableIterator<Array>}
     */ Record.prototype.entries = function() {
        var i;
        return __generator(this, function(_a) {
            switch(_a.label){
                case 0:
                    i = 0;
                    _a.label = 1;
                case 1:
                    if (!(i < this.keys.length)) return [
                        3 /*break*/ ,
                        4
                    ];
                    return [
                        4 /*yield*/ ,
                        [
                            this.keys[i],
                            this._fields[i]
                        ]
                    ];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    i++;
                    return [
                        3 /*break*/ ,
                        1
                    ];
                case 4:
                    return [
                        2 /*return*/ 
                    ];
            }
        });
    };
    /**
     * Iterate over values.
     *
     * @generator
     * @returns {IterableIterator<Object>}
     */ Record.prototype.values = function() {
        var i;
        return __generator(this, function(_a) {
            switch(_a.label){
                case 0:
                    i = 0;
                    _a.label = 1;
                case 1:
                    if (!(i < this.keys.length)) return [
                        3 /*break*/ ,
                        4
                    ];
                    return [
                        4 /*yield*/ ,
                        this._fields[i]
                    ];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    i++;
                    return [
                        3 /*break*/ ,
                        1
                    ];
                case 4:
                    return [
                        2 /*return*/ 
                    ];
            }
        });
    };
    /**
     * Iterate over values. Delegates to {@link Record#values}
     *
     * @generator
     * @returns {IterableIterator<Object>}
     */ Record.prototype[Symbol.iterator] = function() {
        var i;
        return __generator(this, function(_a) {
            switch(_a.label){
                case 0:
                    i = 0;
                    _a.label = 1;
                case 1:
                    if (!(i < this.keys.length)) return [
                        3 /*break*/ ,
                        4
                    ];
                    return [
                        4 /*yield*/ ,
                        this._fields[i]
                    ];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    i++;
                    return [
                        3 /*break*/ ,
                        1
                    ];
                case 4:
                    return [
                        2 /*return*/ 
                    ];
            }
        });
    };
    /**
     * Generates an object out of the current Record
     *
     * @returns {Object}
     */ Record.prototype.toObject = function() {
        var e_3, _a;
        // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
        var obj = {};
        try {
            for(var _b = __values(this.entries()), _c = _b.next(); !_c.done; _c = _b.next()){
                var _d = __read(_c.value, 2), key = _d[0], value = _d[1];
                obj[key] = value;
            }
        } catch (e_3_1) {
            e_3 = {
                error: e_3_1
            };
        } finally{
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            } finally{
                if (e_3) throw e_3.error;
            }
        }
        return obj;
    };
    /**
     * Get a value from this record, either by index or by field key.
     *
     * @param {string|Number} key Field key, or the index of the field.
     * @returns {*}
     */ Record.prototype.get = function(key) {
        var index;
        if (!(typeof key === 'number')) {
            index = this._fieldLookup[key];
            if (index === undefined) {
                throw (0, error_1.newError)("This record has no field with key '".concat(key.toString(), "', available keys are: [") + this.keys.toString() + '].');
            }
        } else {
            index = key;
        }
        if (index > this._fields.length - 1 || index < 0) {
            throw (0, error_1.newError)("This record has no field with index '" + index.toString() + "'. Remember that indexes start at `0`, " + 'and make sure your query returns records in the shape you meant it to.');
        }
        return this._fields[index];
    };
    /**
     * Check if a value from this record, either by index or by field key, exists.
     *
     * @param {string|Number} key Field key, or the index of the field.
     * @returns {boolean}
     */ Record.prototype.has = function(key) {
        // if key is a number, we check if it is in the _fields array
        if (typeof key === 'number') {
            return key >= 0 && key < this._fields.length;
        }
        // if it's not a number, we check _fieldLookup dictionary directly
        return this._fieldLookup[key] !== undefined;
    };
    return Record;
}();
exports.default = Record;
}),
"[project]/frontend/node_modules/neo4j-driver-core/lib/spatial-types.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Point = void 0;
exports.isPoint = isPoint;
/**
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [https://neo4j.com]
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ var util_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/internal/util.js [app-route] (ecmascript)");
var POINT_IDENTIFIER_PROPERTY = '__isPoint__';
/**
 * Represents a single two or three-dimensional point in a particular coordinate reference system.
 * Created `Point` objects are frozen with `Object.freeze()` in constructor and thus immutable.
 */ var Point = function() {
    /**
     * @constructor
     * @param {T} srid - The coordinate reference system identifier.
     * @param {number} x - The `x` coordinate of the point.
     * @param {number} y - The `y` coordinate of the point.
     * @param {number} [z=undefined] - The `z` coordinate of the point or `undefined` if point has 2 dimensions.
     */ function Point(srid, x, y, z) {
        /**
         * The coordinate reference system identifier.
         * @type {T}
         */ this.srid = (0, util_1.assertNumberOrInteger)(srid, 'SRID');
        /**
         * The `x` coordinate of the point.
         * @type {number}
         */ this.x = (0, util_1.assertNumber)(x, 'X coordinate');
        /**
         * The `y` coordinate of the point.
         * @type {number}
         */ this.y = (0, util_1.assertNumber)(y, 'Y coordinate');
        /**
         * The `z` coordinate of the point or `undefined` if point is 2-dimensional.
         * @type {number}
         */ this.z = z === null || z === undefined ? z : (0, util_1.assertNumber)(z, 'Z coordinate');
        Object.freeze(this);
    }
    /**
     * @ignore
     */ Point.prototype.toString = function() {
        return this.z != null && !isNaN(this.z) ? "Point{srid=".concat(formatAsFloat(this.srid), ", x=").concat(formatAsFloat(this.x), ", y=").concat(formatAsFloat(this.y), ", z=").concat(formatAsFloat(this.z), "}") : "Point{srid=".concat(formatAsFloat(this.srid), ", x=").concat(formatAsFloat(this.x), ", y=").concat(formatAsFloat(this.y), "}");
    };
    return Point;
}();
exports.Point = Point;
function formatAsFloat(number) {
    return Number.isInteger(number) ? number.toString() + '.0' : number.toString();
}
Object.defineProperty(Point.prototype, POINT_IDENTIFIER_PROPERTY, {
    value: true,
    enumerable: false,
    configurable: false,
    writable: false
});
/**
 * Test if given object is an instance of {@link Point} class.
 * @param {Object} obj the object to test.
 * @return {boolean} `true` if given object is a {@link Point}, `false` otherwise.
 */ function isPoint(obj) {
    var anyObj = obj;
    return obj != null && anyObj[POINT_IDENTIFIER_PROPERTY] === true;
}
}),
"[project]/frontend/node_modules/neo4j-driver-core/lib/internal/observers.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/**
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [https://neo4j.com]
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.FailedObserver = exports.CompletedObserver = void 0;
var CompletedObserver = function() {
    function CompletedObserver() {}
    CompletedObserver.prototype.subscribe = function(observer) {
        apply(observer, observer.onKeys, []);
        apply(observer, observer.onCompleted, {});
    };
    CompletedObserver.prototype.cancel = function() {
    // do nothing
    };
    CompletedObserver.prototype.pause = function() {
    // do nothing
    };
    CompletedObserver.prototype.resume = function() {
    // do nothing
    };
    CompletedObserver.prototype.prepareToHandleSingleResponse = function() {
    // do nothing
    };
    CompletedObserver.prototype.markCompleted = function() {
    // do nothing
    };
    CompletedObserver.prototype.onError = function(error) {
        // nothing to do, already finished
        // eslint-disable-next-line
        // @ts-ignore: not available in ES oldest supported version
        throw new Error('CompletedObserver not supposed to call onError', {
            cause: error
        });
    };
    return CompletedObserver;
}();
exports.CompletedObserver = CompletedObserver;
var FailedObserver = function() {
    function FailedObserver(_a) {
        var error = _a.error, onError = _a.onError;
        this._error = error;
        this._beforeError = onError;
        this._observers = [];
        this.onError(error);
    }
    FailedObserver.prototype.subscribe = function(observer) {
        apply(observer, observer.onError, this._error);
        this._observers.push(observer);
    };
    FailedObserver.prototype.onError = function(error) {
        apply(this, this._beforeError, error);
        this._observers.forEach(function(o) {
            return apply(o, o.onError, error);
        });
    };
    FailedObserver.prototype.cancel = function() {
    // do nothing
    };
    FailedObserver.prototype.pause = function() {
    // do nothing
    };
    FailedObserver.prototype.resume = function() {
    // do nothing
    };
    FailedObserver.prototype.markCompleted = function() {
    // do nothing
    };
    FailedObserver.prototype.prepareToHandleSingleResponse = function() {
    // do nothing
    };
    return FailedObserver;
}();
exports.FailedObserver = FailedObserver;
function apply(thisArg, func, param) {
    if (func != null) {
        func.bind(thisArg)(param);
    }
}
}),
"[project]/frontend/node_modules/neo4j-driver-core/lib/internal/bookmarks.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/**
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [https://neo4j.com]
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ var __createBinding = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__createBinding || (Object.create ? function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = {
            enumerable: true,
            get: function() {
                return m[k];
            }
        };
    }
    Object.defineProperty(o, k2, desc);
} : function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
});
var __setModuleDefault = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__setModuleDefault || (Object.create ? function(o, v) {
    Object.defineProperty(o, "default", {
        enumerable: true,
        value: v
    });
} : function(o, v) {
    o["default"] = v;
});
var __importStar = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__importStar || function() {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function(o) {
            var ar = [];
            for(var k in o)if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function(mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) {
            for(var k = ownKeys(mod), i = 0; i < k.length; i++)if (k[i] !== "default") __createBinding(result, mod, k[i]);
        }
        __setModuleDefault(result, mod);
        return result;
    };
}();
var __read = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__read || function(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while((n === void 0 || n-- > 0) && !(r = i.next()).done)ar.push(r.value);
    } catch (error) {
        e = {
            error: error
        };
    } finally{
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        } finally{
            if (e) throw e.error;
        }
    }
    return ar;
};
var __spreadArray = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__spreadArray || function(to, from, pack) {
    if (pack || arguments.length === 2) for(var i = 0, l = from.length, ar; i < l; i++){
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Bookmarks = void 0;
var util = __importStar(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/internal/util.js [app-route] (ecmascript)"));
var BOOKMARKS_KEY = 'bookmarks';
var Bookmarks = function() {
    /**
     * @constructor
     * @param {string|string[]} values single bookmark as string or multiple bookmarks as a string array.
     */ function Bookmarks(values) {
        this._values = asStringArray(values);
    }
    Bookmarks.empty = function() {
        return EMPTY_BOOKMARK;
    };
    /**
     * Check if the given Bookmarks holder is meaningful and can be send to the database.
     * @return {boolean} returns `true` bookmarks has a value, `false` otherwise.
     */ Bookmarks.prototype.isEmpty = function() {
        return this._values.length === 0;
    };
    /**
     * Get all bookmarks values as an array.
     * @return {string[]} all values.
     */ Bookmarks.prototype.values = function() {
        return this._values;
    };
    Bookmarks.prototype[Symbol.iterator] = function() {
        return this._values[Symbol.iterator]();
    };
    /**
     * Get these bookmarks as an object for begin transaction call.
     * @return {Object} the value of this bookmarks holder as object.
     */ Bookmarks.prototype.asBeginTransactionParameters = function() {
        var _a;
        if (this.isEmpty()) {
            return {};
        }
        // Driver sends {bookmarks: "max", bookmarks: ["one", "two", "max"]} instead of simple
        // {bookmarks: ["one", "two", "max"]} for backwards compatibility reasons. Old servers can only accept single
        // bookmarks that is why driver has to parse and compare given list of bookmarks. This functionality will
        // eventually be removed.
        return _a = {}, _a[BOOKMARKS_KEY] = this._values, _a;
    };
    return Bookmarks;
}();
exports.Bookmarks = Bookmarks;
var EMPTY_BOOKMARK = new Bookmarks(null);
/**
 * Converts given value to an array.
 * @param {string|string[]|Array} [value=undefined] argument to convert.
 * @return {string[]} value converted to an array.
 */ function asStringArray(value) {
    if (value == null || value === '') {
        return [];
    }
    if (util.isString(value)) {
        return [
            value
        ];
    }
    if (Array.isArray(value)) {
        var result = new Set();
        var flattenedValue = flattenArray(value);
        for(var i = 0; i < flattenedValue.length; i++){
            var element = flattenedValue[i];
            // if it is undefined or null, ignore it
            if (element !== undefined && element !== null) {
                if (!util.isString(element)) {
                    throw new TypeError(// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                    "Bookmark value should be a string, given: '".concat(element, "'"));
                }
                result.add(element);
            }
        }
        return __spreadArray([], __read(result), false);
    }
    throw new TypeError(// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    "Bookmarks should either be a string or a string array, given: '".concat(value, "'"));
}
/**
 * Recursively flattens an array so that the result becomes a single array
 * of values, which does not include any sub-arrays
 *
 * @param {Array} value
 */ function flattenArray(values) {
    return values.reduce(function(dest, value) {
        return Array.isArray(value) ? dest.concat(flattenArray(value)) : dest.concat(value);
    }, []);
}
}),
"[project]/frontend/node_modules/neo4j-driver-core/lib/protocol-version.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/**
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [https://neo4j.com]
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ProtocolVersion = void 0;
/**
 *
 * @access public
 * @class A class representing a protocol version the driver is using to communicate with the server.
 * @param {number} major the major version of the protocol.
 * @param {number} minor the minor version of the protocol.
 */ var ProtocolVersion = function() {
    function ProtocolVersion(major, minor) {
        this.major = major;
        this.minor = minor;
    }
    /**
     *
     * @returns {number} The major version of the protocol
     */ ProtocolVersion.prototype.getMajor = function() {
        return this.major;
    };
    /**
     * @returns {number} The minor version of the protocol
     */ ProtocolVersion.prototype.getMinor = function() {
        return this.major;
    };
    /**
     *
     * @param {ProtocolVersion | {major: number, minor: number}} other the protocol version to compare to
     * @returns {boolean} If this version semantically smaller than the other version.
     */ ProtocolVersion.prototype.isLessThan = function(other) {
        if (this.major < other.major) {
            return true;
        } else if (this.major === other.major && this.minor < other.minor) {
            return true;
        }
        return false;
    };
    /**
     *
     * @param {ProtocolVersion | {major: number, minor: number}} other the protocol version to compare to
     * @returns {boolean} If this version is semantically larger than the other version.
     */ ProtocolVersion.prototype.isGreaterThan = function(other) {
        if (this.major > other.major) {
            return true;
        } else if (this.major === other.major && this.minor > other.minor) {
            return true;
        }
        return false;
    };
    /**
     *
     * @param {ProtocolVersion | {major: number, minor: number}} other the protocol version to compare to
     * @returns {boolean} if this version is semantically larger or equal to the other version.
     */ ProtocolVersion.prototype.isGreaterOrEqualTo = function(other) {
        return !this.isLessThan(other);
    };
    /**
     *
     * @param {ProtocolVersion | {major: number, minor: number}} other the protocol version to compare to
     * @returns {boolean} if this version is semantically smaller or equal to the other version.
     */ ProtocolVersion.prototype.isLessOrEqualTo = function(other) {
        return !this.isGreaterThan(other);
    };
    /**
     *
     * @param {ProtocolVersion | {major: number, minor: number}} other the protocol version to compare to
     * @returns {boolean} If this version is the equal to the other version.
     */ ProtocolVersion.prototype.isEqualTo = function(other) {
        return this.major === other.major && this.minor === other.minor;
    };
    ProtocolVersion.prototype.toString = function() {
        return this.major.toString() + '.' + this.minor.toString();
    };
    return ProtocolVersion;
}();
exports.ProtocolVersion = ProtocolVersion;
}),
"[project]/frontend/node_modules/neo4j-driver-core/lib/internal/constants.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/**
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [https://neo4j.com]
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.TELEMETRY_APIS = exports.BOLT_PROTOCOL_V6_0 = exports.BOLT_PROTOCOL_V5_8 = exports.BOLT_PROTOCOL_V5_7 = exports.BOLT_PROTOCOL_V5_6 = exports.BOLT_PROTOCOL_V5_5 = exports.BOLT_PROTOCOL_V5_4 = exports.BOLT_PROTOCOL_V5_3 = exports.BOLT_PROTOCOL_V5_2 = exports.BOLT_PROTOCOL_V5_1 = exports.BOLT_PROTOCOL_V5_0 = exports.BOLT_PROTOCOL_V4_4 = exports.BOLT_PROTOCOL_V4_3 = exports.BOLT_PROTOCOL_V4_2 = exports.BOLT_PROTOCOL_V4_1 = exports.BOLT_PROTOCOL_V4_0 = exports.BOLT_PROTOCOL_V3 = exports.BOLT_PROTOCOL_V2 = exports.BOLT_PROTOCOL_V1 = exports.DEFAULT_POOL_MAX_SIZE = exports.DEFAULT_POOL_ACQUISITION_TIMEOUT = exports.DEFAULT_CONNECTION_TIMEOUT_MILLIS = exports.ACCESS_MODE_WRITE = exports.ACCESS_MODE_READ = exports.FETCH_ALL = void 0;
var protocol_version_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/protocol-version.js [app-route] (ecmascript)");
var FETCH_ALL = -1;
exports.FETCH_ALL = FETCH_ALL;
var DEFAULT_POOL_ACQUISITION_TIMEOUT = 60 * 1000; // 60 seconds
exports.DEFAULT_POOL_ACQUISITION_TIMEOUT = DEFAULT_POOL_ACQUISITION_TIMEOUT;
var DEFAULT_POOL_MAX_SIZE = 100;
exports.DEFAULT_POOL_MAX_SIZE = DEFAULT_POOL_MAX_SIZE;
var DEFAULT_CONNECTION_TIMEOUT_MILLIS = 30000; // 30 seconds by default
exports.DEFAULT_CONNECTION_TIMEOUT_MILLIS = DEFAULT_CONNECTION_TIMEOUT_MILLIS;
var ACCESS_MODE_READ = 'READ';
exports.ACCESS_MODE_READ = ACCESS_MODE_READ;
var ACCESS_MODE_WRITE = 'WRITE';
exports.ACCESS_MODE_WRITE = ACCESS_MODE_WRITE;
var BOLT_PROTOCOL_V1 = new protocol_version_1.ProtocolVersion(1, 0);
exports.BOLT_PROTOCOL_V1 = BOLT_PROTOCOL_V1;
var BOLT_PROTOCOL_V2 = new protocol_version_1.ProtocolVersion(2, 0);
exports.BOLT_PROTOCOL_V2 = BOLT_PROTOCOL_V2;
var BOLT_PROTOCOL_V3 = new protocol_version_1.ProtocolVersion(3, 0);
exports.BOLT_PROTOCOL_V3 = BOLT_PROTOCOL_V3;
var BOLT_PROTOCOL_V4_0 = new protocol_version_1.ProtocolVersion(4, 0);
exports.BOLT_PROTOCOL_V4_0 = BOLT_PROTOCOL_V4_0;
var BOLT_PROTOCOL_V4_1 = new protocol_version_1.ProtocolVersion(4, 1);
exports.BOLT_PROTOCOL_V4_1 = BOLT_PROTOCOL_V4_1;
var BOLT_PROTOCOL_V4_2 = new protocol_version_1.ProtocolVersion(4, 2);
exports.BOLT_PROTOCOL_V4_2 = BOLT_PROTOCOL_V4_2;
var BOLT_PROTOCOL_V4_3 = new protocol_version_1.ProtocolVersion(4, 3);
exports.BOLT_PROTOCOL_V4_3 = BOLT_PROTOCOL_V4_3;
var BOLT_PROTOCOL_V4_4 = new protocol_version_1.ProtocolVersion(4, 4);
exports.BOLT_PROTOCOL_V4_4 = BOLT_PROTOCOL_V4_4;
var BOLT_PROTOCOL_V5_0 = new protocol_version_1.ProtocolVersion(5, 0);
exports.BOLT_PROTOCOL_V5_0 = BOLT_PROTOCOL_V5_0;
var BOLT_PROTOCOL_V5_1 = new protocol_version_1.ProtocolVersion(5, 1);
exports.BOLT_PROTOCOL_V5_1 = BOLT_PROTOCOL_V5_1;
var BOLT_PROTOCOL_V5_2 = new protocol_version_1.ProtocolVersion(5, 2);
exports.BOLT_PROTOCOL_V5_2 = BOLT_PROTOCOL_V5_2;
var BOLT_PROTOCOL_V5_3 = new protocol_version_1.ProtocolVersion(5, 3);
exports.BOLT_PROTOCOL_V5_3 = BOLT_PROTOCOL_V5_3;
var BOLT_PROTOCOL_V5_4 = new protocol_version_1.ProtocolVersion(5, 4);
exports.BOLT_PROTOCOL_V5_4 = BOLT_PROTOCOL_V5_4;
var BOLT_PROTOCOL_V5_5 = new protocol_version_1.ProtocolVersion(5, 5);
exports.BOLT_PROTOCOL_V5_5 = BOLT_PROTOCOL_V5_5;
var BOLT_PROTOCOL_V5_6 = new protocol_version_1.ProtocolVersion(5, 6);
exports.BOLT_PROTOCOL_V5_6 = BOLT_PROTOCOL_V5_6;
var BOLT_PROTOCOL_V5_7 = new protocol_version_1.ProtocolVersion(5, 7);
exports.BOLT_PROTOCOL_V5_7 = BOLT_PROTOCOL_V5_7;
var BOLT_PROTOCOL_V5_8 = new protocol_version_1.ProtocolVersion(5, 8);
exports.BOLT_PROTOCOL_V5_8 = BOLT_PROTOCOL_V5_8;
var BOLT_PROTOCOL_V6_0 = new protocol_version_1.ProtocolVersion(6, 0);
exports.BOLT_PROTOCOL_V6_0 = BOLT_PROTOCOL_V6_0;
var TELEMETRY_APIS = {
    MANAGED_TRANSACTION: 0,
    UNMANAGED_TRANSACTION: 1,
    AUTO_COMMIT_TRANSACTION: 2,
    EXECUTE_QUERY: 3
};
exports.TELEMETRY_APIS = TELEMETRY_APIS;
}),
"[project]/frontend/node_modules/neo4j-driver-core/lib/internal/logger.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __extends = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__extends || function() {
    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || ({
            __proto__: []
        }) instanceof Array && function(d, b) {
            d.__proto__ = b;
        } || function(d, b) {
            for(var p in b)if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
        };
        return extendStatics(d, b);
    };
    return function(d, b) {
        if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
}();
var _a;
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Logger = void 0;
/**
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [https://neo4j.com]
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ var error_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/error.js [app-route] (ecmascript)");
var ERROR = 'error';
var WARN = 'warn';
var INFO = 'info';
var DEBUG = 'debug';
var DEFAULT_LEVEL = INFO;
var levels = (_a = {}, _a[ERROR] = 0, _a[WARN] = 1, _a[INFO] = 2, _a[DEBUG] = 3, _a);
/**
 * Logger used by the driver to notify about various internal events. Single logger should be used per driver.
 */ var Logger = function() {
    /**
     * @constructor
     * @param {string} level the enabled logging level.
     * @param {function(level: string, message: string)} loggerFunction the function to write the log level and message.
     */ function Logger(level, loggerFunction) {
        this._level = level;
        this._loggerFunction = loggerFunction;
    }
    /**
     * Create a new logger based on the given driver configuration.
     * @param {Object} driverConfig the driver configuration as supplied by the user.
     * @return {Logger} a new logger instance or a no-op logger when not configured.
     */ Logger.create = function(driverConfig) {
        if ((driverConfig === null || driverConfig === void 0 ? void 0 : driverConfig.logging) != null) {
            var loggingConfig = driverConfig.logging;
            var level = extractConfiguredLevel(loggingConfig);
            var loggerFunction = extractConfiguredLogger(loggingConfig);
            return new Logger(level, loggerFunction);
        }
        return this.noOp();
    };
    /**
     * Create a no-op logger implementation.
     * @return {Logger} the no-op logger implementation.
     */ Logger.noOp = function() {
        return noOpLogger;
    };
    /**
     * Check if error logging is enabled, i.e. it is not a no-op implementation.
     * @return {boolean} `true` when enabled, `false` otherwise.
     */ Logger.prototype.isErrorEnabled = function() {
        return isLevelEnabled(this._level, ERROR);
    };
    /**
     * Log an error message.
     * @param {string} message the message to log.
     */ Logger.prototype.error = function(message) {
        if (this.isErrorEnabled()) {
            this._loggerFunction(ERROR, message);
        }
    };
    /**
     * Check if warn logging is enabled, i.e. it is not a no-op implementation.
     * @return {boolean} `true` when enabled, `false` otherwise.
     */ Logger.prototype.isWarnEnabled = function() {
        return isLevelEnabled(this._level, WARN);
    };
    /**
     * Log an warning message.
     * @param {string} message the message to log.
     */ Logger.prototype.warn = function(message) {
        if (this.isWarnEnabled()) {
            this._loggerFunction(WARN, message);
        }
    };
    /**
     * Check if info logging is enabled, i.e. it is not a no-op implementation.
     * @return {boolean} `true` when enabled, `false` otherwise.
     */ Logger.prototype.isInfoEnabled = function() {
        return isLevelEnabled(this._level, INFO);
    };
    /**
     * Log an info message.
     * @param {string} message the message to log.
     */ Logger.prototype.info = function(message) {
        if (this.isInfoEnabled()) {
            this._loggerFunction(INFO, message);
        }
    };
    /**
     * Check if debug logging is enabled, i.e. it is not a no-op implementation.
     * @return {boolean} `true` when enabled, `false` otherwise.
     */ Logger.prototype.isDebugEnabled = function() {
        return isLevelEnabled(this._level, DEBUG);
    };
    /**
     * Log a debug message.
     * @param {string} message the message to log.
     */ Logger.prototype.debug = function(message) {
        if (this.isDebugEnabled()) {
            this._loggerFunction(DEBUG, message);
        }
    };
    return Logger;
}();
exports.Logger = Logger;
var NoOpLogger = function(_super) {
    __extends(NoOpLogger, _super);
    function NoOpLogger() {
        return _super.call(this, INFO, function(level, message) {}) || this;
    }
    NoOpLogger.prototype.isErrorEnabled = function() {
        return false;
    };
    NoOpLogger.prototype.error = function(message) {};
    NoOpLogger.prototype.isWarnEnabled = function() {
        return false;
    };
    NoOpLogger.prototype.warn = function(message) {};
    NoOpLogger.prototype.isInfoEnabled = function() {
        return false;
    };
    NoOpLogger.prototype.info = function(message) {};
    NoOpLogger.prototype.isDebugEnabled = function() {
        return false;
    };
    NoOpLogger.prototype.debug = function(message) {};
    return NoOpLogger;
}(Logger);
var noOpLogger = new NoOpLogger();
/**
 * Check if the given logging level is enabled.
 * @param {string} configuredLevel the configured level.
 * @param {string} targetLevel the level to check.
 * @return {boolean} value of `true` when enabled, `false` otherwise.
 */ function isLevelEnabled(configuredLevel, targetLevel) {
    return levels[configuredLevel] >= levels[targetLevel];
}
/**
 * Extract the configured logging level from the driver's logging configuration.
 * @param {Object} loggingConfig the logging configuration.
 * @return {string} the configured log level or default when none configured.
 */ function extractConfiguredLevel(loggingConfig) {
    if ((loggingConfig === null || loggingConfig === void 0 ? void 0 : loggingConfig.level) != null) {
        var configuredLevel = loggingConfig.level;
        var value = levels[configuredLevel];
        if (value == null && value !== 0) {
            throw (0, error_1.newError)("Illegal logging level: ".concat(configuredLevel, ". Supported levels are: ").concat(Object.keys(levels).toString()));
        }
        return configuredLevel;
    }
    return DEFAULT_LEVEL;
}
/**
 * Extract the configured logger function from the driver's logging configuration.
 * @param {Object} loggingConfig the logging configuration.
 * @return {function(level: string, message: string)} the configured logging function.
 */ function extractConfiguredLogger(loggingConfig) {
    var _a, _b;
    if ((loggingConfig === null || loggingConfig === void 0 ? void 0 : loggingConfig.logger) != null) {
        var configuredLogger = loggingConfig.logger;
        if (configuredLogger != null && typeof configuredLogger === 'function') {
            return configuredLogger;
        }
    }
    throw (0, error_1.newError)("Illegal logger function: ".concat((_b = (_a = loggingConfig === null || loggingConfig === void 0 ? void 0 : loggingConfig.logger) === null || _a === void 0 ? void 0 : _a.toString()) !== null && _b !== void 0 ? _b : 'undefined'));
}
}),
"[project]/frontend/node_modules/neo4j-driver-core/lib/internal/connection-holder.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/**
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [https://neo4j.com]
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ /* eslint-disable @typescript-eslint/promise-function-async */ var __extends = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__extends || function() {
    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || ({
            __proto__: []
        }) instanceof Array && function(d, b) {
            d.__proto__ = b;
        } || function(d, b) {
            for(var p in b)if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
        };
        return extendStatics(d, b);
    };
    return function(d, b) {
        if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
}();
var __awaiter = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__awaiter || function(thisArg, _arguments, P, generator) {
    function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
            resolve(value);
        });
    }
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
                step(generator["throw"](value));
            } catch (e) {
                reject(e);
            }
        }
        function step(result) {
            result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__generator || function(thisArg, body) {
    var _ = {
        label: 0,
        sent: function() {
            if (t[0] & 1) throw t[1];
            return t[1];
        },
        trys: [],
        ops: []
    }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() {
        return this;
    }), g;
    //TURBOPACK unreachable
    ;
    function verb(n) {
        return function(v) {
            return step([
                n,
                v
            ]);
        };
    }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while(g && (g = 0, op[0] && (_ = 0)), _)try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [
                op[0] & 2,
                t.value
            ];
            switch(op[0]){
                case 0:
                case 1:
                    t = op;
                    break;
                case 4:
                    _.label++;
                    return {
                        value: op[1],
                        done: false
                    };
                case 5:
                    _.label++;
                    y = op[1];
                    op = [
                        0
                    ];
                    continue;
                case 7:
                    op = _.ops.pop();
                    _.trys.pop();
                    continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                        _ = 0;
                        continue;
                    }
                    if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                        _.label = op[1];
                        break;
                    }
                    if (op[0] === 6 && _.label < t[1]) {
                        _.label = t[1];
                        t = op;
                        break;
                    }
                    if (t && _.label < t[2]) {
                        _.label = t[2];
                        _.ops.push(op);
                        break;
                    }
                    if (t[2]) _.ops.pop();
                    _.trys.pop();
                    continue;
            }
            op = body.call(thisArg, _);
        } catch (e) {
            op = [
                6,
                e
            ];
            y = 0;
        } finally{
            f = t = 0;
        }
        if (op[0] & 5) throw op[1];
        return {
            value: op[0] ? op[1] : void 0,
            done: true
        };
    }
};
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.EMPTY_CONNECTION_HOLDER = exports.ReadOnlyConnectionHolder = exports.ConnectionHolder = void 0;
var error_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/error.js [app-route] (ecmascript)");
var util_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/internal/util.js [app-route] (ecmascript)");
var constants_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/internal/constants.js [app-route] (ecmascript)");
var bookmarks_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/internal/bookmarks.js [app-route] (ecmascript)");
var logger_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/internal/logger.js [app-route] (ecmascript)");
/**
 * Utility to lazily initialize connections and return them back to the pool when unused.
 * @private
 */ var ConnectionHolder = function() {
    /**
     * @constructor
     * @param {object} params
     * @property {string} params.mode - the access mode for new connection holder.
     * @property {string} params.database - the target database name.
     * @property {Bookmarks} params.bookmarks - initial bookmarks
     * @property {ConnectionProvider} params.connectionProvider - the connection provider to acquire connections from.
     * @property {string?} params.impersonatedUser - the user which will be impersonated
     * @property {function(databaseName:string)} params.onDatabaseNameResolved - callback called when the database name is resolved
     * @property {function():Promise<Bookmarks>} params.getConnectionAcquistionBookmarks - called for getting Bookmarks for acquiring connections
     * @property {AuthToken} params.auth - the target auth for the to-be-acquired connection
     */ function ConnectionHolder(_a) {
        var mode = _a.mode, _b = _a.database, database = _b === void 0 ? '' : _b, bookmarks = _a.bookmarks, connectionProvider = _a.connectionProvider, impersonatedUser = _a.impersonatedUser, onDatabaseNameResolved = _a.onDatabaseNameResolved, getConnectionAcquistionBookmarks = _a.getConnectionAcquistionBookmarks, auth = _a.auth, log = _a.log;
        this._mode = mode !== null && mode !== void 0 ? mode : constants_1.ACCESS_MODE_WRITE;
        this._closed = false;
        this._database = database != null ? (0, util_1.assertString)(database, 'database') : '';
        this._bookmarks = bookmarks !== null && bookmarks !== void 0 ? bookmarks : bookmarks_1.Bookmarks.empty();
        this._connectionProvider = connectionProvider;
        this._impersonatedUser = impersonatedUser;
        this._referenceCount = 0;
        this._connectionPromise = Promise.resolve(null);
        this._onDatabaseNameResolved = onDatabaseNameResolved;
        this._auth = auth;
        this._log = log;
        this._logError = this._logError.bind(this);
        this._getConnectionAcquistionBookmarks = getConnectionAcquistionBookmarks !== null && getConnectionAcquistionBookmarks !== void 0 ? getConnectionAcquistionBookmarks : function() {
            return Promise.resolve(bookmarks_1.Bookmarks.empty());
        };
    }
    ConnectionHolder.prototype.mode = function() {
        return this._mode;
    };
    ConnectionHolder.prototype.database = function() {
        return this._database;
    };
    ConnectionHolder.prototype.setDatabase = function(database) {
        this._database = database;
    };
    ConnectionHolder.prototype.bookmarks = function() {
        return this._bookmarks;
    };
    ConnectionHolder.prototype.connectionProvider = function() {
        return this._connectionProvider;
    };
    ConnectionHolder.prototype.referenceCount = function() {
        return this._referenceCount;
    };
    ConnectionHolder.prototype.initializeConnection = function(homeDatabase) {
        if (this._referenceCount === 0 && this._connectionProvider != null) {
            this._connectionPromise = this._createConnectionPromise(this._connectionProvider, homeDatabase);
        } else {
            this._referenceCount++;
            return false;
        }
        this._referenceCount++;
        return true;
    };
    ConnectionHolder.prototype._createConnectionPromise = function(connectionProvider, homeDatabase) {
        return __awaiter(this, void 0, void 0, function() {
            var _a, _b;
            var _c;
            return __generator(this, function(_d) {
                switch(_d.label){
                    case 0:
                        _b = (_a = connectionProvider).acquireConnection;
                        _c = {
                            accessMode: this._mode,
                            database: this._database
                        };
                        return [
                            4 /*yield*/ ,
                            this._getBookmarks()
                        ];
                    case 1:
                        return [
                            4 /*yield*/ ,
                            _b.apply(_a, [
                                (_c.bookmarks = _d.sent(), _c.impersonatedUser = this._impersonatedUser, _c.onDatabaseNameResolved = this._onDatabaseNameResolved, _c.auth = this._auth, _c.homeDb = homeDatabase, _c)
                            ])
                        ];
                    case 2:
                        return [
                            2 /*return*/ ,
                            _d.sent()
                        ];
                }
            });
        });
    };
    ConnectionHolder.prototype._getBookmarks = function() {
        return __awaiter(this, void 0, void 0, function() {
            return __generator(this, function(_a) {
                switch(_a.label){
                    case 0:
                        return [
                            4 /*yield*/ ,
                            this._getConnectionAcquistionBookmarks()
                        ];
                    case 1:
                        return [
                            2 /*return*/ ,
                            _a.sent()
                        ];
                }
            });
        });
    };
    ConnectionHolder.prototype.getConnection = function() {
        return this._connectionPromise;
    };
    ConnectionHolder.prototype.releaseConnection = function() {
        if (this._referenceCount === 0) {
            return this._connectionPromise;
        }
        this._referenceCount--;
        if (this._referenceCount === 0) {
            return this._releaseConnection();
        }
        return this._connectionPromise;
    };
    ConnectionHolder.prototype.close = function(hasTx) {
        this._closed = true;
        if (this._referenceCount === 0) {
            return this._connectionPromise;
        }
        this._referenceCount = 0;
        return this._releaseConnection(hasTx);
    };
    ConnectionHolder.prototype.log = function() {
        return this._log;
    };
    /**
     * Return the current pooled connection instance to the connection pool.
     * We don't pool Session instances, to avoid users using the Session after they've called close.
     * The `Session` object is just a thin wrapper around Connection anyway, so it makes little difference.
     * @return {Promise} - promise resolved then connection is returned to the pool.
     * @private
     */ ConnectionHolder.prototype._releaseConnection = function(hasTx) {
        this._connectionPromise = this._connectionPromise.then(function(connection) {
            if (connection != null) {
                if (connection.isOpen() && (connection.hasOngoingObservableRequests() || hasTx === true)) {
                    return connection.resetAndFlush().catch(ignoreError).then(function() {
                        return connection.release().then(function() {
                            return null;
                        });
                    });
                }
                return connection.release().then(function() {
                    return null;
                });
            } else {
                return Promise.resolve(null);
            }
        }).catch(this._logError);
        return this._connectionPromise;
    };
    ConnectionHolder.prototype._logError = function(error) {
        if (this._log.isWarnEnabled()) {
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            this._log.warn("ConnectionHolder got an error while releasing the connection. Error ".concat(error, ". Stacktrace: ").concat(error.stack));
        }
        return null;
    };
    return ConnectionHolder;
}();
exports.ConnectionHolder = ConnectionHolder;
/**
 * Provides a interaction with a ConnectionHolder without change it state by
 * releasing or initilizing
 */ var ReadOnlyConnectionHolder = function(_super) {
    __extends(ReadOnlyConnectionHolder, _super);
    /**
     * Constructor
     * @param {ConnectionHolder} connectionHolder the connection holder which will treat the requests
     */ function ReadOnlyConnectionHolder(connectionHolder) {
        var _this = _super.call(this, {
            mode: connectionHolder.mode(),
            database: connectionHolder.database(),
            bookmarks: connectionHolder.bookmarks(),
            // @ts-expect-error
            getConnectionAcquistionBookmarks: connectionHolder._getConnectionAcquistionBookmarks,
            connectionProvider: connectionHolder.connectionProvider(),
            log: connectionHolder.log()
        }) || this;
        _this._connectionHolder = connectionHolder;
        return _this;
    }
    /**
     * Return the true if the connection is suppose to be initilized with the command.
     *
     * @return {boolean}
     */ ReadOnlyConnectionHolder.prototype.initializeConnection = function() {
        if (this._connectionHolder.referenceCount() === 0) {
            return false;
        }
        return true;
    };
    /**
     * Get the current connection promise.
     * @return {Promise<Connection>} promise resolved with the current connection.
     */ ReadOnlyConnectionHolder.prototype.getConnection = function() {
        return this._connectionHolder.getConnection();
    };
    /**
     * Get the current connection promise, doesn't performs the release
     * @return {Promise<Connection>} promise with the resolved current connection
     */ ReadOnlyConnectionHolder.prototype.releaseConnection = function() {
        return this._connectionHolder.getConnection().catch(function() {
            return Promise.resolve(null);
        });
    };
    /**
     * Get the current connection promise, doesn't performs the connection close
     * @return {Promise<Connection>} promise with the resolved current connection
     */ ReadOnlyConnectionHolder.prototype.close = function() {
        return this._connectionHolder.getConnection().catch(function() {
            return Promise.resolve(null);
        });
    };
    return ReadOnlyConnectionHolder;
}(ConnectionHolder);
exports.ReadOnlyConnectionHolder = ReadOnlyConnectionHolder;
exports.default = ReadOnlyConnectionHolder;
var EmptyConnectionHolder = function(_super) {
    __extends(EmptyConnectionHolder, _super);
    function EmptyConnectionHolder() {
        return _super.call(this, {
            // Empty logger
            log: logger_1.Logger.create({})
        }) || this;
    }
    EmptyConnectionHolder.prototype.mode = function() {
        return undefined;
    };
    EmptyConnectionHolder.prototype.database = function() {
        return undefined;
    };
    EmptyConnectionHolder.prototype.initializeConnection = function() {
        // nothing to initialize
        return true;
    };
    EmptyConnectionHolder.prototype.getConnection = function() {
        return __awaiter(this, void 0, void 0, function() {
            return __generator(this, function(_a) {
                switch(_a.label){
                    case 0:
                        return [
                            4 /*yield*/ ,
                            Promise.reject((0, error_1.newError)('This connection holder does not serve connections'))
                        ];
                    case 1:
                        return [
                            2 /*return*/ ,
                            _a.sent()
                        ];
                }
            });
        });
    };
    EmptyConnectionHolder.prototype.releaseConnection = function() {
        return __awaiter(this, void 0, void 0, function() {
            return __generator(this, function(_a) {
                switch(_a.label){
                    case 0:
                        return [
                            4 /*yield*/ ,
                            Promise.resolve(null)
                        ];
                    case 1:
                        return [
                            2 /*return*/ ,
                            _a.sent()
                        ];
                }
            });
        });
    };
    EmptyConnectionHolder.prototype.close = function() {
        return __awaiter(this, void 0, void 0, function() {
            return __generator(this, function(_a) {
                switch(_a.label){
                    case 0:
                        return [
                            4 /*yield*/ ,
                            Promise.resolve(null)
                        ];
                    case 1:
                        return [
                            2 /*return*/ ,
                            _a.sent()
                        ];
                }
            });
        });
    };
    return EmptyConnectionHolder;
}(ConnectionHolder);
/**
 * Connection holder that does not manage any connections.
 * @type {ConnectionHolder}
 * @private
 */ var EMPTY_CONNECTION_HOLDER = new EmptyConnectionHolder();
exports.EMPTY_CONNECTION_HOLDER = EMPTY_CONNECTION_HOLDER;
// eslint-disable-next-line n/handle-callback-err
function ignoreError(error) {
    return null;
}
}),
"[project]/frontend/node_modules/neo4j-driver-core/lib/internal/tx-config.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/**
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [https://neo4j.com]
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ var __createBinding = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__createBinding || (Object.create ? function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = {
            enumerable: true,
            get: function() {
                return m[k];
            }
        };
    }
    Object.defineProperty(o, k2, desc);
} : function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
});
var __setModuleDefault = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__setModuleDefault || (Object.create ? function(o, v) {
    Object.defineProperty(o, "default", {
        enumerable: true,
        value: v
    });
} : function(o, v) {
    o["default"] = v;
});
var __importStar = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__importStar || function() {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function(o) {
            var ar = [];
            for(var k in o)if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function(mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) {
            for(var k = ownKeys(mod), i = 0; i < k.length; i++)if (k[i] !== "default") __createBinding(result, mod, k[i]);
        }
        __setModuleDefault(result, mod);
        return result;
    };
}();
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.TxConfig = void 0;
var util = __importStar(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/internal/util.js [app-route] (ecmascript)"));
var error_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/error.js [app-route] (ecmascript)");
var integer_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/integer.js [app-route] (ecmascript)");
/**
 * Internal holder of the transaction configuration.
 * It performs input validation and value conversion for further serialization by the Bolt protocol layer.
 * Users of the driver provide transaction configuration as regular objects `{timeout: 10, metadata: {key: 'value'}}`.
 * Driver converts such objects to {@link TxConfig} immediately and uses converted values everywhere.
 */ var TxConfig = function() {
    /**
     * @constructor
     * @param {Object} config the raw configuration object.
     */ function TxConfig(config, log) {
        assertValidConfig(config);
        this.timeout = extractTimeout(config, log);
        this.metadata = extractMetadata(config);
    }
    /**
     * Get an empty config object.
     * @return {TxConfig} an empty config.
     */ TxConfig.empty = function() {
        return EMPTY_CONFIG;
    };
    /**
     * Check if this config object is empty. I.e. has no configuration values specified.
     * @return {boolean} `true` if this object is empty, `false` otherwise.
     */ TxConfig.prototype.isEmpty = function() {
        return Object.values(this).every(function(value) {
            return value == null;
        });
    };
    return TxConfig;
}();
exports.TxConfig = TxConfig;
var EMPTY_CONFIG = new TxConfig({});
/**
 * @return {Integer|null}
 */ function extractTimeout(config, log) {
    if (util.isObject(config) && config.timeout != null) {
        util.assertNumberOrInteger(config.timeout, 'Transaction timeout');
        if (isTimeoutFloat(config) && (log === null || log === void 0 ? void 0 : log.isInfoEnabled()) === true) {
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            log === null || log === void 0 ? void 0 : log.info("Transaction timeout expected to be an integer, got: ".concat(config.timeout, ". The value will be rounded up."));
        }
        var timeout = (0, integer_1.int)(config.timeout, {
            ceilFloat: true
        });
        if (timeout.isNegative()) {
            throw (0, error_1.newError)('Transaction timeout should not be negative');
        }
        return timeout;
    }
    return null;
}
function isTimeoutFloat(config) {
    return typeof config.timeout === 'number' && !Number.isInteger(config.timeout);
}
/**
 * @return {object|null}
 */ function extractMetadata(config) {
    if (util.isObject(config) && config.metadata != null) {
        var metadata = config.metadata;
        util.assertObject(metadata, 'config.metadata');
        if (Object.keys(metadata).length !== 0) {
            // not an empty object
            return metadata;
        }
    }
    return null;
}
function assertValidConfig(config) {
    if (config != null) {
        util.assertObject(config, 'Transaction config');
    }
}
}),
"[project]/frontend/node_modules/neo4j-driver-core/lib/internal/transaction-executor.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __assign = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__assign || function() {
    __assign = Object.assign || function(t) {
        for(var s, i = 1, n = arguments.length; i < n; i++){
            s = arguments[i];
            for(var p in s)if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__awaiter || function(thisArg, _arguments, P, generator) {
    function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
            resolve(value);
        });
    }
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
                step(generator["throw"](value));
            } catch (e) {
                reject(e);
            }
        }
        function step(result) {
            result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__generator || function(thisArg, body) {
    var _ = {
        label: 0,
        sent: function() {
            if (t[0] & 1) throw t[1];
            return t[1];
        },
        trys: [],
        ops: []
    }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() {
        return this;
    }), g;
    //TURBOPACK unreachable
    ;
    function verb(n) {
        return function(v) {
            return step([
                n,
                v
            ]);
        };
    }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while(g && (g = 0, op[0] && (_ = 0)), _)try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [
                op[0] & 2,
                t.value
            ];
            switch(op[0]){
                case 0:
                case 1:
                    t = op;
                    break;
                case 4:
                    _.label++;
                    return {
                        value: op[1],
                        done: false
                    };
                case 5:
                    _.label++;
                    y = op[1];
                    op = [
                        0
                    ];
                    continue;
                case 7:
                    op = _.ops.pop();
                    _.trys.pop();
                    continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                        _ = 0;
                        continue;
                    }
                    if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                        _.label = op[1];
                        break;
                    }
                    if (op[0] === 6 && _.label < t[1]) {
                        _.label = t[1];
                        t = op;
                        break;
                    }
                    if (t && _.label < t[2]) {
                        _.label = t[2];
                        _.ops.push(op);
                        break;
                    }
                    if (t[2]) _.ops.pop();
                    _.trys.pop();
                    continue;
            }
            op = body.call(thisArg, _);
        } catch (e) {
            op = [
                6,
                e
            ];
            y = 0;
        } finally{
            f = t = 0;
        }
        if (op[0] & 5) throw op[1];
        return {
            value: op[0] ? op[1] : void 0,
            done: true
        };
    }
};
var __read = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__read || function(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while((n === void 0 || n-- > 0) && !(r = i.next()).done)ar.push(r.value);
    } catch (error) {
        e = {
            error: error
        };
    } finally{
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        } finally{
            if (e) throw e.error;
        }
    }
    return ar;
};
var __spreadArray = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__spreadArray || function(to, from, pack) {
    if (pack || arguments.length === 2) for(var i = 0, l = from.length, ar; i < l; i++){
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.TransactionExecutor = void 0;
/**
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [https://neo4j.com]
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ /* eslint-disable @typescript-eslint/promise-function-async */ var error_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/error.js [app-route] (ecmascript)");
var constants_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/internal/constants.js [app-route] (ecmascript)");
var DEFAULT_MAX_RETRY_TIME_MS = 30 * 1000; // 30 seconds
var DEFAULT_INITIAL_RETRY_DELAY_MS = 1000; // 1 seconds
var DEFAULT_RETRY_DELAY_MULTIPLIER = 2.0;
var DEFAULT_RETRY_DELAY_JITTER_FACTOR = 0.2;
function setTimeoutWrapper(callback, ms) {
    var args = [];
    for(var _i = 2; _i < arguments.length; _i++){
        args[_i - 2] = arguments[_i];
    }
    return setTimeout.apply(void 0, __spreadArray([
        callback,
        ms
    ], __read(args), false));
}
function clearTimeoutWrapper(timeoutId) {
    return clearTimeout(timeoutId);
}
var TransactionExecutor = function() {
    function TransactionExecutor(maxRetryTimeMs, initialRetryDelayMs, multiplier, jitterFactor, dependencies) {
        if (dependencies === void 0) {
            dependencies = {
                setTimeout: setTimeoutWrapper,
                clearTimeout: clearTimeoutWrapper
            };
        }
        this._maxRetryTimeMs = _valueOrDefault(maxRetryTimeMs, DEFAULT_MAX_RETRY_TIME_MS);
        this._initialRetryDelayMs = _valueOrDefault(initialRetryDelayMs, DEFAULT_INITIAL_RETRY_DELAY_MS);
        this._multiplier = _valueOrDefault(multiplier, DEFAULT_RETRY_DELAY_MULTIPLIER);
        this._jitterFactor = _valueOrDefault(jitterFactor, DEFAULT_RETRY_DELAY_JITTER_FACTOR);
        this._setTimeout = dependencies.setTimeout;
        this._clearTimeout = dependencies.clearTimeout;
        this._inFlightTimeoutIds = [];
        this.pipelineBegin = false;
        this.telemetryApi = constants_1.TELEMETRY_APIS.MANAGED_TRANSACTION;
        this._verifyAfterConstruction();
    }
    TransactionExecutor.prototype.execute = function(transactionCreator, transactionWork, transactionWrapper) {
        var _this = this;
        var context = {
            apiTransactionConfig: {
                api: this.telemetryApi,
                onTelemetrySuccess: function() {
                    context.apiTransactionConfig = undefined;
                }
            }
        };
        return new Promise(function(resolve, reject) {
            _this._executeTransactionInsidePromise(transactionCreator, transactionWork, resolve, reject, transactionWrapper, context).catch(reject);
        }).catch(function(error) {
            var retryStartTimeMs = Date.now();
            var retryDelayMs = _this._initialRetryDelayMs;
            return _this._retryTransactionPromise(transactionCreator, transactionWork, error, retryStartTimeMs, retryDelayMs, transactionWrapper, context);
        });
    };
    TransactionExecutor.prototype.close = function() {
        var _this = this;
        // cancel all existing timeouts to prevent further retries
        this._inFlightTimeoutIds.forEach(function(timeoutId) {
            return _this._clearTimeout(timeoutId);
        });
        this._inFlightTimeoutIds = [];
    };
    TransactionExecutor.prototype._retryTransactionPromise = function(transactionCreator, transactionWork, error, retryStartTime, retryDelayMs, transactionWrapper, executionContext) {
        var _this = this;
        var elapsedTimeMs = Date.now() - retryStartTime;
        if (elapsedTimeMs > this._maxRetryTimeMs || !(0, error_1.isRetryableError)(error)) {
            return Promise.reject(error);
        }
        return new Promise(function(resolve, reject) {
            var nextRetryTime = _this._computeDelayWithJitter(retryDelayMs);
            var timeoutId = _this._setTimeout(function() {
                // filter out this timeoutId when time has come and function is being executed
                _this._inFlightTimeoutIds = _this._inFlightTimeoutIds.filter(function(id) {
                    return id !== timeoutId;
                });
                _this._executeTransactionInsidePromise(transactionCreator, transactionWork, resolve, reject, transactionWrapper, executionContext).catch(reject);
            }, nextRetryTime);
            // add newly created timeoutId to the list of all in-flight timeouts
            _this._inFlightTimeoutIds.push(timeoutId);
        }).catch(function(error) {
            var nextRetryDelayMs = retryDelayMs * _this._multiplier;
            return _this._retryTransactionPromise(transactionCreator, transactionWork, error, retryStartTime, nextRetryDelayMs, transactionWrapper, executionContext);
        });
    };
    TransactionExecutor.prototype._executeTransactionInsidePromise = function(transactionCreator, transactionWork, resolve, reject, transactionWrapper, executionContext) {
        return __awaiter(this, void 0, void 0, function() {
            var tx, txPromise, _a, error_2, wrap, wrappedTx, resultPromise;
            var _this = this;
            return __generator(this, function(_b) {
                switch(_b.label){
                    case 0:
                        _b.trys.push([
                            0,
                            4,
                            ,
                            5
                        ]);
                        txPromise = transactionCreator((executionContext === null || executionContext === void 0 ? void 0 : executionContext.apiTransactionConfig) != null ? __assign({}, executionContext === null || executionContext === void 0 ? void 0 : executionContext.apiTransactionConfig) : undefined);
                        if (!this.pipelineBegin) return [
                            3 /*break*/ ,
                            1
                        ];
                        _a = txPromise;
                        return [
                            3 /*break*/ ,
                            3
                        ];
                    case 1:
                        return [
                            4 /*yield*/ ,
                            txPromise
                        ];
                    case 2:
                        _a = _b.sent();
                        _b.label = 3;
                    case 3:
                        tx = _a;
                        return [
                            3 /*break*/ ,
                            5
                        ];
                    case 4:
                        error_2 = _b.sent();
                        // failed to create a transaction
                        reject(error_2);
                        return [
                            2 /*return*/ 
                        ];
                    case 5:
                        wrap = transactionWrapper !== null && transactionWrapper !== void 0 ? transactionWrapper : function(tx) {
                            return tx;
                        };
                        wrappedTx = wrap(tx);
                        resultPromise = this._safeExecuteTransactionWork(wrappedTx, transactionWork);
                        resultPromise.then(function(result) {
                            return _this._handleTransactionWorkSuccess(result, tx, resolve, reject);
                        }).catch(function(error) {
                            return _this._handleTransactionWorkFailure(error, tx, reject);
                        });
                        return [
                            2 /*return*/ 
                        ];
                }
            });
        });
    };
    TransactionExecutor.prototype._safeExecuteTransactionWork = function(tx, transactionWork) {
        try {
            var result = transactionWork(tx);
            // user defined callback is supposed to return a promise, but it might not; so to protect against an
            // incorrect API usage we wrap the returned value with a resolved promise; this is effectively a
            // validation step without type checks
            return Promise.resolve(result);
        } catch (error) {
            return Promise.reject(error);
        }
    };
    TransactionExecutor.prototype._handleTransactionWorkSuccess = function(result, tx, resolve, reject) {
        if (tx.isOpen()) {
            // transaction work returned resolved promise and transaction has not been committed/rolled back
            // try to commit the transaction
            tx.commit().then(function() {
                // transaction was committed, return result to the user
                resolve(result);
            }).catch(function(error) {
                // transaction failed to commit, propagate the failure
                reject(error);
            });
        } else {
            // transaction work returned resolved promise and transaction is already committed/rolled back
            // return the result returned by given transaction work
            resolve(result);
        }
    };
    TransactionExecutor.prototype._handleTransactionWorkFailure = function(error, tx, reject) {
        if (tx.isOpen()) {
            // transaction work failed and the transaction is still open, roll it back and propagate the failure
            tx.rollback().catch(function(ignore) {
            // ignore the rollback error
            }).then(function() {
                return reject(error);
            }) // propagate the original error we got from the transaction work
            .catch(reject);
        } else {
            // transaction is already rolled back, propagate the error
            reject(error);
        }
    };
    TransactionExecutor.prototype._computeDelayWithJitter = function(delayMs) {
        var jitter = delayMs * this._jitterFactor;
        var min = delayMs - jitter;
        var max = delayMs + jitter;
        return Math.random() * (max - min) + min;
    };
    TransactionExecutor.prototype._verifyAfterConstruction = function() {
        if (this._maxRetryTimeMs < 0) {
            throw (0, error_1.newError)('Max retry time should be >= 0: ' + this._maxRetryTimeMs.toString());
        }
        if (this._initialRetryDelayMs < 0) {
            throw (0, error_1.newError)('Initial retry delay should >= 0: ' + this._initialRetryDelayMs.toString());
        }
        if (this._multiplier < 1.0) {
            throw (0, error_1.newError)('Multiplier should be >= 1.0: ' + this._multiplier.toString());
        }
        if (this._jitterFactor < 0 || this._jitterFactor > 1) {
            throw (0, error_1.newError)('Jitter factor should be in [0.0, 1.0]: ' + this._jitterFactor.toFixed());
        }
    };
    return TransactionExecutor;
}();
exports.TransactionExecutor = TransactionExecutor;
function _valueOrDefault(value, defaultValue) {
    if (value != null) {
        return value;
    }
    return defaultValue;
}
}),
"[project]/frontend/node_modules/neo4j-driver-core/lib/internal/url-util.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/**
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [https://neo4j.com]
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ var __assign = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__assign || function() {
    __assign = Object.assign || function(t) {
        for(var s, i = 1, n = arguments.length; i < n; i++){
            s = arguments[i];
            for(var p in s)if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __read = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__read || function(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while((n === void 0 || n-- > 0) && !(r = i.next()).done)ar.push(r.value);
    } catch (error) {
        e = {
            error: error
        };
    } finally{
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        } finally{
            if (e) throw e.error;
        }
    }
    return ar;
};
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Url = void 0;
exports.parseDatabaseUrl = parseDatabaseUrl;
exports.defaultPortForScheme = defaultPortForScheme;
exports.formatIPv4Address = formatIPv4Address;
exports.formatIPv6Address = formatIPv6Address;
var util_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/internal/util.js [app-route] (ecmascript)");
var DEFAULT_BOLT_PORT = 7687;
var DEFAULT_HTTP_PORT = 7474;
var DEFAULT_HTTPS_PORT = 7473;
var Url = function() {
    function Url(scheme, host, port, hostAndPort, query) {
        /**
         * Nullable scheme (protocol) of the URL.
         * Example: 'bolt', 'neo4j', 'http', 'https', etc.
         * @type {string}
         */ this.scheme = scheme;
        /**
         * Nonnull host name or IP address. IPv6 not wrapped in square brackets.
         * Example: 'neo4j.com', 'localhost', '127.0.0.1', '192.168.10.15', '::1', '2001:4860:4860::8844', etc.
         * @type {string}
         */ this.host = host;
        /**
         * Nonnull number representing port. Default port for the given scheme is used if given URL string
         * does not contain port. Example: 7687 for bolt, 7474 for HTTP and 7473 for HTTPS.
         * @type {number}
         */ this.port = port;
        /**
         * Nonnull host name or IP address plus port, separated by ':'. IPv6 wrapped in square brackets.
         * Example: 'neo4j.com', 'neo4j.com:7687', '127.0.0.1', '127.0.0.1:8080', '[2001:4860:4860::8844]',
         * '[2001:4860:4860::8844]:9090', etc.
         * @type {string}
         */ this.hostAndPort = hostAndPort;
        /**
         * Nonnull object representing parsed query string key-value pairs. Duplicated keys not supported.
         * Example: '{}', '{'key1': 'value1', 'key2': 'value2'}', etc.
         * @type {Object}
         */ this.query = query;
    }
    return Url;
}();
exports.Url = Url;
function parseDatabaseUrl(url) {
    var _a;
    (0, util_1.assertString)(url, 'URL');
    var sanitized = sanitizeUrl(url);
    var parsedUrl = uriJsParse(sanitized.url);
    var scheme = sanitized.schemeMissing ? null : extractScheme(parsedUrl.scheme);
    var host = extractHost(parsedUrl.host); // no square brackets for IPv6
    var formattedHost = formatHost(host); // has square brackets for IPv6
    var port = extractPort(parsedUrl.port, scheme);
    var hostAndPort = "".concat(formattedHost, ":").concat(port);
    var query = extractQuery(// @ts-expect-error
    (_a = parsedUrl.query) !== null && _a !== void 0 ? _a : extractResourceQueryString(parsedUrl.resourceName), url);
    return new Url(scheme, host, port, hostAndPort, query);
}
function extractResourceQueryString(resource) {
    if (typeof resource !== 'string') {
        return null;
    }
    var _a = __read(resource.split('?'), 2), query = _a[1];
    return query;
}
function sanitizeUrl(url) {
    url = url.trim();
    if (!url.includes('://')) {
        // url does not contain scheme, add dummy 'none://' to make parser work correctly
        return {
            schemeMissing: true,
            url: "none://".concat(url)
        };
    }
    return {
        schemeMissing: false,
        url: url
    };
}
function extractScheme(scheme) {
    if (scheme != null) {
        scheme = scheme.trim();
        if (scheme.charAt(scheme.length - 1) === ':') {
            scheme = scheme.substring(0, scheme.length - 1);
        }
        return scheme;
    }
    return null;
}
function extractHost(host, url) {
    if (host == null) {
        throw new Error('Unable to extract host from null or undefined URL');
    }
    return host.trim();
}
function extractPort(portString, scheme) {
    var port = typeof portString === 'string' ? parseInt(portString, 10) : portString;
    return port != null && !isNaN(port) ? port : defaultPortForScheme(scheme);
}
function extractQuery(queryString, url) {
    var query = queryString != null ? trimAndSanitizeQuery(queryString) : null;
    var context = {};
    if (query != null) {
        query.split('&').forEach(function(pair) {
            var keyValue = pair.split('=');
            if (keyValue.length !== 2) {
                throw new Error("Invalid parameters: '".concat(keyValue.toString(), "' in URL '").concat(url, "'."));
            }
            var key = trimAndVerifyQueryElement(keyValue[0], 'key', url);
            var value = trimAndVerifyQueryElement(keyValue[1], 'value', url);
            if (context[key] !== undefined) {
                throw new Error("Duplicated query parameters with key '".concat(key, "' in URL '").concat(url, "'"));
            }
            context[key] = value;
        });
    }
    return context;
}
function trimAndSanitizeQuery(query) {
    query = (query !== null && query !== void 0 ? query : '').trim();
    if ((query === null || query === void 0 ? void 0 : query.charAt(0)) === '?') {
        query = query.substring(1, query.length);
    }
    return query;
}
function trimAndVerifyQueryElement(element, name, url) {
    element = (element !== null && element !== void 0 ? element : '').trim();
    if (element === '') {
        throw new Error("Illegal empty ".concat(name, " in URL query '").concat(url, "'"));
    }
    return element;
}
function escapeIPv6Address(address) {
    var startsWithSquareBracket = address.charAt(0) === '[';
    var endsWithSquareBracket = address.charAt(address.length - 1) === ']';
    if (!startsWithSquareBracket && !endsWithSquareBracket) {
        return "[".concat(address, "]");
    } else if (startsWithSquareBracket && endsWithSquareBracket) {
        return address;
    } else {
        throw new Error("Illegal IPv6 address ".concat(address));
    }
}
function formatHost(host) {
    if (host === '' || host == null) {
        throw new Error("Illegal host ".concat(host));
    }
    var isIPv6Address = host.includes(':');
    return isIPv6Address ? escapeIPv6Address(host) : host;
}
function formatIPv4Address(address, port) {
    return "".concat(address, ":").concat(port);
}
function formatIPv6Address(address, port) {
    var escapedAddress = escapeIPv6Address(address);
    return "".concat(escapedAddress, ":").concat(port);
}
function defaultPortForScheme(scheme) {
    if (scheme === 'http') {
        return DEFAULT_HTTP_PORT;
    } else if (scheme === 'https') {
        return DEFAULT_HTTPS_PORT;
    } else {
        return DEFAULT_BOLT_PORT;
    }
}
function uriJsParse(value) {
    // JS version of Python partition function
    function partition(s, delimiter) {
        var i = s.indexOf(delimiter);
        if (i >= 0) return [
            s.substring(0, i),
            s[i],
            s.substring(i + 1)
        ];
        else return [
            s,
            '',
            ''
        ];
    }
    // JS version of Python rpartition function
    function rpartition(s, delimiter) {
        var i = s.lastIndexOf(delimiter);
        if (i >= 0) return [
            s.substring(0, i),
            s[i],
            s.substring(i + 1)
        ];
        else return [
            '',
            '',
            s
        ];
    }
    function between(s, ldelimiter, rdelimiter) {
        var lpartition = partition(s, ldelimiter);
        var rpartition = partition(lpartition[2], rdelimiter);
        return [
            rpartition[0],
            rpartition[2]
        ];
    }
    // Parse an authority string into an object
    // with the following keys:
    // - userInfo (optional, might contain both user name and password)
    // - host
    // - port (optional, included only as a string)
    function parseAuthority(value) {
        var parsed = {};
        var parts;
        // Parse user info
        parts = rpartition(value, '@');
        if (parts[1] === '@') {
            parsed.userInfo = decodeURIComponent(parts[0]);
            value = parts[2];
        }
        // Parse host and port
        var _a = __read(between(value, '[', ']'), 2), ipv6Host = _a[0], rest = _a[1];
        if (ipv6Host !== '') {
            parsed.host = ipv6Host;
            parts = partition(rest, ':');
        } else {
            parts = partition(value, ':');
            parsed.host = parts[0];
        }
        if (parts[1] === ':') {
            parsed.port = parts[2];
        }
        return parsed;
    }
    var parsed = {};
    var parts;
    // Parse scheme
    parts = partition(value, ':');
    if (parts[1] === ':') {
        parsed.scheme = decodeURIComponent(parts[0]);
        value = parts[2];
    }
    // Parse fragment
    parts = partition(value, '#');
    if (parts[1] === '#') {
        parsed.fragment = decodeURIComponent(parts[2]);
        value = parts[0];
    }
    // Parse query
    parts = partition(value, '?');
    if (parts[1] === '?') {
        parsed.query = parts[2];
        value = parts[0];
    }
    // Parse authority and path
    if (value.startsWith('//')) {
        parts = partition(value.substr(2), '/');
        parsed = __assign(__assign({}, parsed), parseAuthority(parts[0]));
        parsed.path = parts[1] + parts[2];
    } else {
        parsed.path = value;
    }
    return parsed;
}
}),
"[project]/frontend/node_modules/neo4j-driver-core/lib/internal/server-address.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __createBinding = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__createBinding || (Object.create ? function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = {
            enumerable: true,
            get: function() {
                return m[k];
            }
        };
    }
    Object.defineProperty(o, k2, desc);
} : function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
});
var __setModuleDefault = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__setModuleDefault || (Object.create ? function(o, v) {
    Object.defineProperty(o, "default", {
        enumerable: true,
        value: v
    });
} : function(o, v) {
    o["default"] = v;
});
var __importStar = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__importStar || function() {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function(o) {
            var ar = [];
            for(var k in o)if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function(mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) {
            for(var k = ownKeys(mod), i = 0; i < k.length; i++)if (k[i] !== "default") __createBinding(result, mod, k[i]);
        }
        __setModuleDefault(result, mod);
        return result;
    };
}();
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ServerAddress = void 0;
/**
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [https://neo4j.com]
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ var util_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/internal/util.js [app-route] (ecmascript)");
var urlUtil = __importStar(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/internal/url-util.js [app-route] (ecmascript)"));
var ServerAddress = function() {
    function ServerAddress(host, resolved, port, hostPort) {
        this._host = (0, util_1.assertString)(host, 'host');
        this._resolved = resolved != null ? (0, util_1.assertString)(resolved, 'resolved') : null;
        this._port = (0, util_1.assertNumber)(port, 'port');
        this._hostPort = hostPort;
        this._stringValue = resolved != null ? "".concat(hostPort, "(").concat(resolved, ")") : "".concat(hostPort);
    }
    ServerAddress.prototype.host = function() {
        return this._host;
    };
    ServerAddress.prototype.resolvedHost = function() {
        return this._resolved != null ? this._resolved : this._host;
    };
    ServerAddress.prototype.port = function() {
        return this._port;
    };
    ServerAddress.prototype.resolveWith = function(resolved) {
        return new ServerAddress(this._host, resolved, this._port, this._hostPort);
    };
    ServerAddress.prototype.asHostPort = function() {
        return this._hostPort;
    };
    ServerAddress.prototype.asKey = function() {
        return this._hostPort;
    };
    ServerAddress.prototype.toString = function() {
        return this._stringValue;
    };
    ServerAddress.fromUrl = function(url) {
        var urlParsed = urlUtil.parseDatabaseUrl(url);
        return new ServerAddress(urlParsed.host, null, urlParsed.port, urlParsed.hostAndPort);
    };
    return ServerAddress;
}();
exports.ServerAddress = ServerAddress;
}),
"[project]/frontend/node_modules/neo4j-driver-core/lib/internal/resolver/base-host-name-resolver.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/**
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [https://neo4j.com]
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ /* eslint-disable @typescript-eslint/promise-function-async */ Object.defineProperty(exports, "__esModule", {
    value: true
});
var BaseHostNameResolver = function() {
    function BaseHostNameResolver() {}
    BaseHostNameResolver.prototype.resolve = function() {
        throw new Error('Abstract function');
    };
    /**
     * @protected
     */ BaseHostNameResolver.prototype._resolveToItself = function(address) {
        return Promise.resolve([
            address
        ]);
    };
    return BaseHostNameResolver;
}();
exports.default = BaseHostNameResolver;
}),
"[project]/frontend/node_modules/neo4j-driver-core/lib/internal/resolver/configured-custom-resolver.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
/**
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [https://neo4j.com]
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ /* eslint-disable @typescript-eslint/promise-function-async */ var server_address_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/internal/server-address.js [app-route] (ecmascript)");
function resolveToSelf(address) {
    return Promise.resolve([
        address
    ]);
}
var ConfiguredCustomResolver = function() {
    function ConfiguredCustomResolver(resolverFunction) {
        this._resolverFunction = resolverFunction !== null && resolverFunction !== void 0 ? resolverFunction : resolveToSelf;
    }
    ConfiguredCustomResolver.prototype.resolve = function(seedRouter) {
        var _this = this;
        return new Promise(function(resolve) {
            return resolve(_this._resolverFunction(seedRouter.asHostPort()));
        }).then(function(resolved) {
            if (!Array.isArray(resolved)) {
                throw new TypeError('Configured resolver function should either return an array of addresses or a Promise resolved with an array of addresses.' + // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                "Each address is '<host>:<port>'. Got: ".concat(resolved));
            }
            return resolved.map(function(r) {
                return server_address_1.ServerAddress.fromUrl(r);
            });
        });
    };
    return ConfiguredCustomResolver;
}();
exports.default = ConfiguredCustomResolver;
}),
"[project]/frontend/node_modules/neo4j-driver-core/lib/internal/resolver/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __importDefault = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : {
        "default": mod
    };
};
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ConfiguredCustomResolver = exports.BaseHostNameResolver = void 0;
/**
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [https://neo4j.com]
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ var base_host_name_resolver_1 = __importDefault(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/internal/resolver/base-host-name-resolver.js [app-route] (ecmascript)"));
exports.BaseHostNameResolver = base_host_name_resolver_1.default;
var configured_custom_resolver_1 = __importDefault(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/internal/resolver/configured-custom-resolver.js [app-route] (ecmascript)"));
exports.ConfiguredCustomResolver = configured_custom_resolver_1.default;
}),
"[project]/frontend/node_modules/neo4j-driver-core/lib/internal/bolt-agent/node/bolt-agent.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.fromVersion = fromVersion;
/**
* Copyright (c) "Neo4j"
* Neo4j Sweden AB [https://neo4j.com]
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
*     http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/ var os_1 = __turbopack_context__.r("[externals]/os [external] (os, cjs)");
/**
 * Constructs a BoltAgent structure from a given product version.
 *
 * @param {string} version The product version
 * @param {function():SystemInfo} getSystemInfo Parameter used of inject system information and mock calls to the APIs.
 * @returns {BoltAgent} The bolt agent
 */ function fromVersion(version, getSystemInfo) {
    if (getSystemInfo === void 0) {
        getSystemInfo = function() {
            return {
                hostArch: process.config.variables.host_arch,
                nodeVersion: process.versions.node,
                v8Version: process.versions.v8,
                get platform () {
                    return (0, os_1.platform)();
                },
                get release () {
                    return (0, os_1.release)();
                }
            };
        };
    }
    var systemInfo = getSystemInfo();
    var HOST_ARCH = systemInfo.hostArch;
    var NODE_VERSION = 'Node/' + systemInfo.nodeVersion;
    var NODE_V8_VERSION = systemInfo.v8Version;
    var OS_NAME_VERSION = "".concat(systemInfo.platform, " ").concat(systemInfo.release);
    return {
        product: "neo4j-javascript/".concat(version),
        platform: "".concat(OS_NAME_VERSION, "; ").concat(HOST_ARCH),
        languageDetails: "".concat(NODE_VERSION, " (v8 ").concat(NODE_V8_VERSION, ")")
    };
}
}),
"[project]/frontend/node_modules/neo4j-driver-core/lib/internal/bolt-agent/node/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/**
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [https://neo4j.com]
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ var __createBinding = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__createBinding || (Object.create ? function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = {
            enumerable: true,
            get: function() {
                return m[k];
            }
        };
    }
    Object.defineProperty(o, k2, desc);
} : function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
});
var __exportStar = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__exportStar || function(m, exports1) {
    for(var p in m)if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports1, p)) __createBinding(exports1, m, p);
};
Object.defineProperty(exports, "__esModule", {
    value: true
});
__exportStar(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/internal/bolt-agent/node/bolt-agent.js [app-route] (ecmascript)"), exports);
}),
"[project]/frontend/node_modules/neo4j-driver-core/lib/internal/bolt-agent/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/**
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [https://neo4j.com]
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ var __createBinding = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__createBinding || (Object.create ? function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = {
            enumerable: true,
            get: function() {
                return m[k];
            }
        };
    }
    Object.defineProperty(o, k2, desc);
} : function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
});
var __exportStar = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__exportStar || function(m, exports1) {
    for(var p in m)if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports1, p)) __createBinding(exports1, m, p);
};
Object.defineProperty(exports, "__esModule", {
    value: true
});
__exportStar(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/internal/bolt-agent/node/index.js [app-route] (ecmascript)"), exports);
}),
"[project]/frontend/node_modules/neo4j-driver-core/lib/internal/pool/pool-config.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/**
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [https://neo4j.com]
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.DEFAULT_ACQUISITION_TIMEOUT = exports.DEFAULT_MAX_SIZE = void 0;
var DEFAULT_MAX_SIZE = 100;
exports.DEFAULT_MAX_SIZE = DEFAULT_MAX_SIZE;
var DEFAULT_ACQUISITION_TIMEOUT = 60 * 1000; // 60 seconds
exports.DEFAULT_ACQUISITION_TIMEOUT = DEFAULT_ACQUISITION_TIMEOUT;
var PoolConfig = function() {
    function PoolConfig(maxSize, acquisitionTimeout) {
        this.maxSize = valueOrDefault(maxSize, DEFAULT_MAX_SIZE);
        this.acquisitionTimeout = valueOrDefault(acquisitionTimeout, DEFAULT_ACQUISITION_TIMEOUT);
    }
    PoolConfig.defaultConfig = function() {
        return new PoolConfig(DEFAULT_MAX_SIZE, DEFAULT_ACQUISITION_TIMEOUT);
    };
    PoolConfig.fromDriverConfig = function(config) {
        var maxSize = isConfigured(config.maxConnectionPoolSize) ? config.maxConnectionPoolSize : DEFAULT_MAX_SIZE;
        var acquisitionTimeout = isConfigured(config.connectionAcquisitionTimeout) ? config.connectionAcquisitionTimeout : DEFAULT_ACQUISITION_TIMEOUT;
        return new PoolConfig(maxSize, acquisitionTimeout);
    };
    return PoolConfig;
}();
exports.default = PoolConfig;
function valueOrDefault(value, defaultValue) {
    return isConfigured(value) ? value : defaultValue;
}
function isConfigured(value) {
    return value === 0 || value != null;
}
}),
"[project]/frontend/node_modules/neo4j-driver-core/lib/internal/pool/pool.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/**
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [https://neo4j.com]
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ var __awaiter = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__awaiter || function(thisArg, _arguments, P, generator) {
    function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
            resolve(value);
        });
    }
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
                step(generator["throw"](value));
            } catch (e) {
                reject(e);
            }
        }
        function step(result) {
            result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__generator || function(thisArg, body) {
    var _ = {
        label: 0,
        sent: function() {
            if (t[0] & 1) throw t[1];
            return t[1];
        },
        trys: [],
        ops: []
    }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() {
        return this;
    }), g;
    //TURBOPACK unreachable
    ;
    function verb(n) {
        return function(v) {
            return step([
                n,
                v
            ]);
        };
    }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while(g && (g = 0, op[0] && (_ = 0)), _)try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [
                op[0] & 2,
                t.value
            ];
            switch(op[0]){
                case 0:
                case 1:
                    t = op;
                    break;
                case 4:
                    _.label++;
                    return {
                        value: op[1],
                        done: false
                    };
                case 5:
                    _.label++;
                    y = op[1];
                    op = [
                        0
                    ];
                    continue;
                case 7:
                    op = _.ops.pop();
                    _.trys.pop();
                    continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                        _ = 0;
                        continue;
                    }
                    if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                        _.label = op[1];
                        break;
                    }
                    if (op[0] === 6 && _.label < t[1]) {
                        _.label = t[1];
                        t = op;
                        break;
                    }
                    if (t && _.label < t[2]) {
                        _.label = t[2];
                        _.ops.push(op);
                        break;
                    }
                    if (t[2]) _.ops.pop();
                    _.trys.pop();
                    continue;
            }
            op = body.call(thisArg, _);
        } catch (e) {
            op = [
                6,
                e
            ];
            y = 0;
        } finally{
            f = t = 0;
        }
        if (op[0] & 5) throw op[1];
        return {
            value: op[0] ? op[1] : void 0,
            done: true
        };
    }
};
var __importDefault = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : {
        "default": mod
    };
};
Object.defineProperty(exports, "__esModule", {
    value: true
});
var pool_config_1 = __importDefault(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/internal/pool/pool-config.js [app-route] (ecmascript)"));
var error_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/error.js [app-route] (ecmascript)");
var logger_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/internal/logger.js [app-route] (ecmascript)");
var Pool = function() {
    /**
     * @param {function(acquisitionContext: object, address: ServerAddress, function(address: ServerAddress, resource: object): Promise<object>): Promise<object>} create
     *                an allocation function that creates a promise with a new resource. It's given an address for which to
     *                allocate the connection and a function that will return the resource to the pool if invoked, which is
     *                meant to be called on .dispose or .close or whatever mechanism the resource uses to finalize.
     * @param {function(acquisitionContext: object, resource: object): boolean} validateOnAcquire
     *                called at various times when an instance is acquired
     *                If this returns false, the resource will be evicted
     * @param {function(resource: object): boolean} validateOnRelease
     *                called at various times when an instance is released
     *                If this returns false, the resource will be evicted
     * @param {function(resource: object): Promise<void>} destroy
     *                called with the resource when it is evicted from this pool
     * @param {function(resource: object, observer: { onError }): void} installIdleObserver
     *                called when the resource is released back to pool
     * @param {function(resource: object): void} removeIdleObserver
     *                called when the resource is acquired from the pool
     * @param {PoolConfig} config configuration for the new driver.
     * @param {Logger} log the driver logger.
     */ function Pool(_a) {
        var _b = _a.create, create = _b === void 0 ? function(acquisitionContext, address, release) {
            return __awaiter(_this, void 0, void 0, function() {
                return __generator(this, function(_a) {
                    switch(_a.label){
                        case 0:
                            return [
                                4 /*yield*/ ,
                                Promise.reject(new Error('Not implemented'))
                            ];
                        case 1:
                            return [
                                2 /*return*/ ,
                                _a.sent()
                            ];
                    }
                });
            });
        } : _b, _c = _a.destroy, destroy = _c === void 0 ? function(conn) {
            return __awaiter(_this, void 0, void 0, function() {
                return __generator(this, function(_a) {
                    switch(_a.label){
                        case 0:
                            return [
                                4 /*yield*/ ,
                                Promise.resolve()
                            ];
                        case 1:
                            return [
                                2 /*return*/ ,
                                _a.sent()
                            ];
                    }
                });
            });
        } : _c, _d = _a.validateOnAcquire, validateOnAcquire = _d === void 0 ? function(acquisitionContext, conn) {
            return true;
        } : _d, _e = _a.validateOnRelease, validateOnRelease = _e === void 0 ? function(conn) {
            return true;
        } : _e, _f = _a.installIdleObserver, installIdleObserver = _f === void 0 ? function(conn, observer) {} : _f, _g = _a.removeIdleObserver, removeIdleObserver = _g === void 0 ? function(conn) {} : _g, _h = _a.config, config = _h === void 0 ? pool_config_1.default.defaultConfig() : _h, _j = _a.log, log = _j === void 0 ? logger_1.Logger.noOp() : _j;
        var _this = this;
        this._create = create;
        this._destroy = destroy;
        this._validateOnAcquire = validateOnAcquire;
        this._validateOnRelease = validateOnRelease;
        this._installIdleObserver = installIdleObserver;
        this._removeIdleObserver = removeIdleObserver;
        this._maxSize = config.maxSize;
        this._acquisitionTimeout = config.acquisitionTimeout;
        this._pools = {};
        this._pendingCreates = {};
        this._acquireRequests = {};
        this._activeResourceCounts = {};
        this._release = this._release.bind(this);
        this._log = log;
        this._closed = false;
    }
    /**
     * Acquire and idle resource fom the pool or create a new one.
     * @param {object} acquisitionContext the acquisition context used for create and validateOnAcquire connection
     * @param {ServerAddress} address the address for which we're acquiring.
     * @param {object} config the config
     * @param {boolean} config.requireNew Indicate it requires a new resource
     * @return {Promise<Object>} resource that is ready to use.
     */ Pool.prototype.acquire = function(acquisitionContext, address, config) {
        return __awaiter(this, void 0, void 0, function() {
            var key, allRequests, requests, elapsedTime;
            var _this = this;
            return __generator(this, function(_a) {
                switch(_a.label){
                    case 0:
                        key = address.asKey();
                        allRequests = this._acquireRequests;
                        requests = allRequests[key];
                        elapsedTime = acquisitionContext.startTime != null && acquisitionContext.startTime !== 0 ? new Date().getTime() - acquisitionContext.startTime : 0;
                        if (elapsedTime >= this._acquisitionTimeout) {
                            throw this.getAcquisitionTimeoutError(address);
                        }
                        if (requests == null) {
                            allRequests[key] = [];
                        }
                        return [
                            4 /*yield*/ ,
                            new Promise(function(resolve, reject) {
                                var timeoutId = setTimeout(function() {
                                    // acquisition timeout fired
                                    // remove request from the queue of pending requests, if it's still there
                                    // request might've been taken out by the release operation
                                    var pendingRequests = allRequests[key];
                                    if (pendingRequests != null) {
                                        allRequests[key] = pendingRequests.filter(function(item) {
                                            return item !== request;
                                        });
                                    }
                                    if (request.isCompleted()) {
                                    // request already resolved/rejected by the release operation; nothing to do
                                    } else {
                                        // request is still pending and needs to be failed
                                        request.reject(_this.getAcquisitionTimeoutError(address));
                                    }
                                }, _this._acquisitionTimeout - elapsedTime);
                                if (typeof timeoutId === 'object') {
                                    // eslint-disable-next-line
                                    // @ts-ignore
                                    timeoutId.unref();
                                }
                                var request = new PendingRequest(key, acquisitionContext, config, resolve, reject, timeoutId, _this._log);
                                allRequests[key].push(request);
                                _this._processPendingAcquireRequests(address);
                            })
                        ];
                    case 1:
                        return [
                            2 /*return*/ ,
                            _a.sent()
                        ];
                }
            });
        });
    };
    Pool.prototype.getAcquisitionTimeoutError = function(address) {
        var key = address.asKey();
        var activeCount = this.activeResourceCount(address);
        var idleCount = this.has(address) ? this._pools[key].length : 0;
        return (0, error_1.newError)("Connection acquisition timed out in ".concat(this._acquisitionTimeout, " ms. Pool status: Active conn count = ").concat(activeCount, ", Idle conn count = ").concat(idleCount, "."));
    };
    /**
     * Destroy all idle resources for the given address.
     * @param {ServerAddress} address the address of the server to purge its pool.
     * @returns {Promise<void>} A promise that is resolved when the resources are purged
     */ Pool.prototype.purge = function(address) {
        return __awaiter(this, void 0, void 0, function() {
            return __generator(this, function(_a) {
                switch(_a.label){
                    case 0:
                        return [
                            4 /*yield*/ ,
                            this._purgeKey(address.asKey())
                        ];
                    case 1:
                        return [
                            2 /*return*/ ,
                            _a.sent()
                        ];
                }
            });
        });
    };
    Pool.prototype.apply = function(address, resourceConsumer) {
        var key = address.asKey();
        if (key in this._pools) {
            this._pools[key].apply(resourceConsumer);
        }
    };
    /**
     * Destroy all idle resources in this pool.
     * @returns {Promise<void>} A promise that is resolved when the resources are purged
     */ Pool.prototype.close = function() {
        return __awaiter(this, void 0, void 0, function() {
            var _this = this;
            return __generator(this, function(_a) {
                switch(_a.label){
                    case 0:
                        this._closed = true;
                        return [
                            4 /*yield*/ ,
                            Promise.all(Object.keys(this._pools).map(function(key) {
                                return __awaiter(_this, void 0, void 0, function() {
                                    return __generator(this, function(_a) {
                                        switch(_a.label){
                                            case 0:
                                                return [
                                                    4 /*yield*/ ,
                                                    this._purgeKey(key)
                                                ];
                                            case 1:
                                                return [
                                                    2 /*return*/ ,
                                                    _a.sent()
                                                ];
                                        }
                                    });
                                });
                            })).then()
                        ];
                    case 1:
                        /**
                     * The lack of Promise consuming was making the driver do not close properly in the scenario
                     * captured at result.test.js:it('should handle missing onCompleted'). The test was timing out
                     * because while waiting for the driver close.
                     *
                     * Consuming the Promise.all or by calling then or by awaiting in the result inside this method solved
                     * the issue somehow.
                     *
                     * PS: the return of this method was already awaited at PooledConnectionProvider.close, but the await bellow
                     * seems to be need also.
                     */ return [
                            2 /*return*/ ,
                            _a.sent()
                        ];
                }
            });
        });
    };
    /**
     * Keep the idle resources for the provided addresses and purge the rest.
     * @returns {Promise<void>} A promise that is resolved when the other resources are purged
     */ Pool.prototype.keepAll = function(addresses) {
        return __awaiter(this, void 0, void 0, function() {
            var keysToKeep, keysPresent, keysToPurge;
            var _this = this;
            return __generator(this, function(_a) {
                switch(_a.label){
                    case 0:
                        keysToKeep = addresses.map(function(a) {
                            return a.asKey();
                        });
                        keysPresent = Object.keys(this._pools);
                        keysToPurge = keysPresent.filter(function(k) {
                            return !keysToKeep.includes(k);
                        });
                        return [
                            4 /*yield*/ ,
                            Promise.all(keysToPurge.map(function(key) {
                                return __awaiter(_this, void 0, void 0, function() {
                                    return __generator(this, function(_a) {
                                        switch(_a.label){
                                            case 0:
                                                return [
                                                    4 /*yield*/ ,
                                                    this._purgeKey(key)
                                                ];
                                            case 1:
                                                return [
                                                    2 /*return*/ ,
                                                    _a.sent()
                                                ];
                                        }
                                    });
                                });
                            })).then()
                        ];
                    case 1:
                        return [
                            2 /*return*/ ,
                            _a.sent()
                        ];
                }
            });
        });
    };
    /**
     * Check if this pool contains resources for the given address.
     * @param {ServerAddress} address the address of the server to check.
     * @return {boolean} `true` when pool contains entries for the given key, <code>false</code> otherwise.
     */ Pool.prototype.has = function(address) {
        return address.asKey() in this._pools;
    };
    /**
     * Get count of active (checked out of the pool) resources for the given key.
     * @param {ServerAddress} address the address of the server to check.
     * @return {number} count of resources acquired by clients.
     */ Pool.prototype.activeResourceCount = function(address) {
        var _a;
        return (_a = this._activeResourceCounts[address.asKey()]) !== null && _a !== void 0 ? _a : 0;
    };
    Pool.prototype._getOrInitializePoolFor = function(key) {
        var pool = this._pools[key];
        if (pool == null) {
            pool = new SingleAddressPool();
            this._pools[key] = pool;
            this._pendingCreates[key] = 0;
        }
        return pool;
    };
    Pool.prototype._acquire = function(acquisitionContext, address, requireNew) {
        return __awaiter(this, void 0, void 0, function() {
            var key, pool, resource_1, valid, e_1, numConnections, resource, numConnections, resource_2;
            var _this = this;
            return __generator(this, function(_a) {
                switch(_a.label){
                    case 0:
                        if (this._closed) {
                            throw (0, error_1.newError)('Pool is closed, it is no more able to serve requests.');
                        }
                        key = address.asKey();
                        pool = this._getOrInitializePoolFor(key);
                        if (!!requireNew) return [
                            3 /*break*/ ,
                            10
                        ];
                        _a.label = 1;
                    case 1:
                        if (!(pool.length > 0)) return [
                            3 /*break*/ ,
                            10
                        ];
                        resource_1 = pool.pop();
                        if (resource_1 == null) {
                            return [
                                3 /*break*/ ,
                                1
                            ];
                        }
                        resourceAcquired(key, this._activeResourceCounts);
                        if (this._removeIdleObserver != null) {
                            this._removeIdleObserver(resource_1);
                        }
                        valid = false;
                        _a.label = 2;
                    case 2:
                        _a.trys.push([
                            2,
                            4,
                            ,
                            6
                        ]);
                        return [
                            4 /*yield*/ ,
                            this._validateOnAcquire(acquisitionContext, resource_1)
                        ];
                    case 3:
                        valid = _a.sent();
                        return [
                            3 /*break*/ ,
                            6
                        ];
                    case 4:
                        e_1 = _a.sent();
                        resourceReleased(key, this._activeResourceCounts);
                        pool.removeInUse(resource_1);
                        return [
                            4 /*yield*/ ,
                            this._destroy(resource_1)
                        ];
                    case 5:
                        _a.sent();
                        throw e_1;
                    case 6:
                        if (!valid) return [
                            3 /*break*/ ,
                            7
                        ];
                        // idle resource is valid and can be acquired
                        if (this._log.isDebugEnabled()) {
                            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                            this._log.debug("".concat(resource_1, " acquired from the pool ").concat(key));
                        }
                        return [
                            2 /*return*/ ,
                            {
                                resource: resource_1,
                                pool: pool
                            }
                        ];
                    case 7:
                        resourceReleased(key, this._activeResourceCounts);
                        pool.removeInUse(resource_1);
                        return [
                            4 /*yield*/ ,
                            this._destroy(resource_1)
                        ];
                    case 8:
                        _a.sent();
                        _a.label = 9;
                    case 9:
                        return [
                            3 /*break*/ ,
                            1
                        ];
                    case 10:
                        // Ensure requested max pool size
                        if (this._maxSize > 0) {
                            numConnections = this.activeResourceCount(address) + this._pendingCreates[key];
                            if (numConnections >= this._maxSize) {
                                // Will put this request in queue instead since the pool is full
                                return [
                                    2 /*return*/ ,
                                    {
                                        resource: null,
                                        pool: pool
                                    }
                                ];
                            }
                        }
                        // there exist no idle valid resources, create a new one for acquisition
                        // Keep track of how many pending creates there are to avoid making too many connections.
                        this._pendingCreates[key] = this._pendingCreates[key] + 1;
                        _a.label = 11;
                    case 11:
                        _a.trys.push([
                            11,
                            ,
                            15,
                            16
                        ]);
                        numConnections = this.activeResourceCount(address) + pool.length;
                        if (!(numConnections >= this._maxSize && requireNew)) return [
                            3 /*break*/ ,
                            13
                        ];
                        resource_2 = pool.pop();
                        if (!(resource_2 != null)) return [
                            3 /*break*/ ,
                            13
                        ];
                        if (this._removeIdleObserver != null) {
                            this._removeIdleObserver(resource_2);
                        }
                        pool.removeInUse(resource_2);
                        return [
                            4 /*yield*/ ,
                            this._destroy(resource_2)
                        ];
                    case 12:
                        _a.sent();
                        _a.label = 13;
                    case 13:
                        return [
                            4 /*yield*/ ,
                            this._create(acquisitionContext, address, function(address, resource) {
                                return __awaiter(_this, void 0, void 0, function() {
                                    return __generator(this, function(_a) {
                                        switch(_a.label){
                                            case 0:
                                                return [
                                                    4 /*yield*/ ,
                                                    this._release(address, resource, pool)
                                                ];
                                            case 1:
                                                return [
                                                    2 /*return*/ ,
                                                    _a.sent()
                                                ];
                                        }
                                    });
                                });
                            })
                        ];
                    case 14:
                        // Invoke callback that creates actual connection
                        resource = _a.sent();
                        pool.pushInUse(resource);
                        resourceAcquired(key, this._activeResourceCounts);
                        if (this._log.isDebugEnabled()) {
                            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                            this._log.debug("".concat(resource, " created for the pool ").concat(key));
                        }
                        return [
                            3 /*break*/ ,
                            16
                        ];
                    case 15:
                        this._pendingCreates[key] = this._pendingCreates[key] - 1;
                        return [
                            7 /*endfinally*/ 
                        ];
                    case 16:
                        return [
                            2 /*return*/ ,
                            {
                                resource: resource,
                                pool: pool
                            }
                        ];
                }
            });
        });
    };
    Pool.prototype._release = function(address, resource, pool) {
        return __awaiter(this, void 0, void 0, function() {
            var key;
            var _this = this;
            return __generator(this, function(_a) {
                switch(_a.label){
                    case 0:
                        key = address.asKey();
                        _a.label = 1;
                    case 1:
                        _a.trys.push([
                            1,
                            ,
                            9,
                            10
                        ]);
                        if (!pool.isActive()) return [
                            3 /*break*/ ,
                            6
                        ];
                        return [
                            4 /*yield*/ ,
                            this._validateOnRelease(resource)
                        ];
                    case 2:
                        if (!!_a.sent()) return [
                            3 /*break*/ ,
                            4
                        ];
                        if (this._log.isDebugEnabled()) {
                            this._log.debug(// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                            "".concat(resource, " destroyed and can't be released to the pool ").concat(key, " because it is not functional"));
                        }
                        pool.removeInUse(resource);
                        return [
                            4 /*yield*/ ,
                            this._destroy(resource)
                        ];
                    case 3:
                        _a.sent();
                        return [
                            3 /*break*/ ,
                            5
                        ];
                    case 4:
                        if (this._installIdleObserver != null) {
                            this._installIdleObserver(resource, {
                                onError: function(error) {
                                    _this._log.debug(// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                                    "Idle connection ".concat(resource, " destroyed because of error: ").concat(error));
                                    var pool = _this._pools[key];
                                    if (pool != null) {
                                        _this._pools[key] = pool.filter(function(r) {
                                            return r !== resource;
                                        });
                                        pool.removeInUse(resource);
                                    }
                                    // let's not care about background clean-ups due to errors but just trigger the destroy
                                    // process for the resource, we especially catch any errors and ignore them to avoid
                                    // unhandled promise rejection warnings
                                    _this._destroy(resource).catch(function() {});
                                }
                            });
                        }
                        pool.push(resource);
                        if (this._log.isDebugEnabled()) {
                            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                            this._log.debug("".concat(resource, " released to the pool ").concat(key));
                        }
                        _a.label = 5;
                    case 5:
                        return [
                            3 /*break*/ ,
                            8
                        ];
                    case 6:
                        // key has been purged, don't put it back, just destroy the resource
                        if (this._log.isDebugEnabled()) {
                            this._log.debug(// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                            "".concat(resource, " destroyed and can't be released to the pool ").concat(key, " because pool has been purged"));
                        }
                        pool.removeInUse(resource);
                        return [
                            4 /*yield*/ ,
                            this._destroy(resource)
                        ];
                    case 7:
                        _a.sent();
                        _a.label = 8;
                    case 8:
                        return [
                            3 /*break*/ ,
                            10
                        ];
                    case 9:
                        resourceReleased(key, this._activeResourceCounts);
                        this._processPendingAcquireRequests(address);
                        return [
                            7 /*endfinally*/ 
                        ];
                    case 10:
                        return [
                            2 /*return*/ 
                        ];
                }
            });
        });
    };
    Pool.prototype._purgeKey = function(key) {
        return __awaiter(this, void 0, void 0, function() {
            var pool, destructionList, resource;
            return __generator(this, function(_a) {
                switch(_a.label){
                    case 0:
                        pool = this._pools[key];
                        destructionList = [];
                        if (!(pool != null)) return [
                            3 /*break*/ ,
                            2
                        ];
                        while(pool.length > 0){
                            resource = pool.pop();
                            if (resource == null) {
                                continue;
                            }
                            if (this._removeIdleObserver != null) {
                                this._removeIdleObserver(resource);
                            }
                            destructionList.push(this._destroy(resource));
                        }
                        pool.close();
                        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
                        delete this._pools[key];
                        return [
                            4 /*yield*/ ,
                            Promise.all(destructionList)
                        ];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        return [
                            2 /*return*/ 
                        ];
                }
            });
        });
    };
    Pool.prototype._processPendingAcquireRequests = function(address) {
        var _this = this;
        var key = address.asKey();
        var requests = this._acquireRequests[key];
        if (requests != null) {
            var pendingRequest_1 = requests.shift(); // pop a pending acquire request
            if (pendingRequest_1 != null) {
                this._acquire(pendingRequest_1.context, address, pendingRequest_1.requireNew).catch(function(error) {
                    // failed to acquire/create a new connection to resolve the pending acquire request
                    // propagate the error by failing the pending request
                    pendingRequest_1.reject(error);
                    return {
                        resource: null,
                        pool: null
                    };
                }).then(function(_a) {
                    var resource = _a.resource, pool = _a.pool;
                    // there is not situation where the pool resource is not null and the
                    // pool is null.
                    if (resource != null && pool != null) {
                        // managed to acquire a valid resource from the pool
                        if (pendingRequest_1.isCompleted()) {
                            // request has been completed, most likely failed by a timeout
                            // return the acquired resource back to the pool
                            _this._release(address, resource, pool).catch(function(error) {
                                if (_this._log.isDebugEnabled()) {
                                    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                                    _this._log.debug("".concat(resource, " could not be release back to the pool. Cause: ").concat(error));
                                }
                            });
                        } else {
                            // request is still pending and can be resolved with the newly acquired resource
                            pendingRequest_1.resolve(resource); // resolve the pending request with the acquired resource
                        }
                    } else {
                        // failed to acquire a valid resource from the pool
                        // return the pending request back to the pool
                        if (!pendingRequest_1.isCompleted()) {
                            if (_this._acquireRequests[key] == null) {
                                _this._acquireRequests[key] = [];
                            }
                            _this._acquireRequests[key].unshift(pendingRequest_1);
                        }
                    }
                }).catch(function(error) {
                    return pendingRequest_1.reject(error);
                });
            } else {
                // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
                delete this._acquireRequests[key];
            }
        }
    };
    return Pool;
}();
/**
 * Increment active (checked out of the pool) resource counter.
 * @param {string} key the resource group identifier (server address for connections).
 * @param {Object.<string, number>} activeResourceCounts the object holding active counts per key.
 */ function resourceAcquired(key, activeResourceCounts) {
    var _a;
    var currentCount = (_a = activeResourceCounts[key]) !== null && _a !== void 0 ? _a : 0;
    activeResourceCounts[key] = currentCount + 1;
}
/**
 * Decrement active (checked out of the pool) resource counter.
 * @param {string} key the resource group identifier (server address for connections).
 * @param {Object.<string, number>} activeResourceCounts the object holding active counts per key.
 */ function resourceReleased(key, activeResourceCounts) {
    var _a;
    var currentCount = (_a = activeResourceCounts[key]) !== null && _a !== void 0 ? _a : 0;
    var nextCount = currentCount - 1;
    if (nextCount > 0) {
        activeResourceCounts[key] = nextCount;
    } else {
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete activeResourceCounts[key];
    }
}
var PendingRequest = function() {
    function PendingRequest(key, context, config, resolve, reject, timeoutId, log) {
        this._key = key;
        this._context = context;
        this._resolve = resolve;
        this._reject = reject;
        this._timeoutId = timeoutId;
        this._log = log;
        this._completed = false;
        this._config = config !== null && config !== void 0 ? config : {};
    }
    Object.defineProperty(PendingRequest.prototype, "context", {
        get: function() {
            return this._context;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PendingRequest.prototype, "requireNew", {
        get: function() {
            var _a;
            return (_a = this._config.requireNew) !== null && _a !== void 0 ? _a : false;
        },
        enumerable: false,
        configurable: true
    });
    PendingRequest.prototype.isCompleted = function() {
        return this._completed;
    };
    PendingRequest.prototype.resolve = function(resource) {
        if (this._completed) {
            return;
        }
        this._completed = true;
        clearTimeout(this._timeoutId);
        if (this._log.isDebugEnabled()) {
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            this._log.debug("".concat(resource, " acquired from the pool ").concat(this._key));
        }
        this._resolve(resource);
    };
    PendingRequest.prototype.reject = function(error) {
        if (this._completed) {
            return;
        }
        this._completed = true;
        clearTimeout(this._timeoutId);
        this._reject(error);
    };
    return PendingRequest;
}();
var SingleAddressPool = function() {
    function SingleAddressPool() {
        this._active = true;
        this._elements = [];
        this._elementsInUse = new Set();
    }
    SingleAddressPool.prototype.isActive = function() {
        return this._active;
    };
    SingleAddressPool.prototype.close = function() {
        this._active = false;
        this._elements = [];
        this._elementsInUse = new Set();
    };
    SingleAddressPool.prototype.filter = function(predicate) {
        this._elements = this._elements.filter(predicate);
        return this;
    };
    SingleAddressPool.prototype.apply = function(resourceConsumer) {
        this._elements.forEach(resourceConsumer);
        this._elementsInUse.forEach(resourceConsumer);
    };
    Object.defineProperty(SingleAddressPool.prototype, "length", {
        get: function() {
            return this._elements.length;
        },
        enumerable: false,
        configurable: true
    });
    SingleAddressPool.prototype.pop = function() {
        var element = this._elements.pop();
        if (element != null) {
            this._elementsInUse.add(element);
        }
        return element;
    };
    SingleAddressPool.prototype.push = function(element) {
        this._elementsInUse.delete(element);
        return this._elements.push(element);
    };
    SingleAddressPool.prototype.pushInUse = function(element) {
        this._elementsInUse.add(element);
    };
    SingleAddressPool.prototype.removeInUse = function(element) {
        this._elementsInUse.delete(element);
    };
    return SingleAddressPool;
}();
exports.default = Pool;
}),
"[project]/frontend/node_modules/neo4j-driver-core/lib/internal/pool/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/**
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [https://neo4j.com]
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ var __createBinding = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__createBinding || (Object.create ? function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = {
            enumerable: true,
            get: function() {
                return m[k];
            }
        };
    }
    Object.defineProperty(o, k2, desc);
} : function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
});
var __setModuleDefault = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__setModuleDefault || (Object.create ? function(o, v) {
    Object.defineProperty(o, "default", {
        enumerable: true,
        value: v
    });
} : function(o, v) {
    o["default"] = v;
});
var __importStar = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__importStar || function() {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function(o) {
            var ar = [];
            for(var k in o)if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function(mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) {
            for(var k = ownKeys(mod), i = 0; i < k.length; i++)if (k[i] !== "default") __createBinding(result, mod, k[i]);
        }
        __setModuleDefault(result, mod);
        return result;
    };
}();
var __importDefault = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : {
        "default": mod
    };
};
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.DEFAULT_MAX_SIZE = exports.DEFAULT_ACQUISITION_TIMEOUT = exports.PoolConfig = exports.Pool = void 0;
var pool_config_1 = __importStar(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/internal/pool/pool-config.js [app-route] (ecmascript)"));
exports.PoolConfig = pool_config_1.default;
Object.defineProperty(exports, "DEFAULT_ACQUISITION_TIMEOUT", {
    enumerable: true,
    get: function() {
        return pool_config_1.DEFAULT_ACQUISITION_TIMEOUT;
    }
});
Object.defineProperty(exports, "DEFAULT_MAX_SIZE", {
    enumerable: true,
    get: function() {
        return pool_config_1.DEFAULT_MAX_SIZE;
    }
});
var pool_1 = __importDefault(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/internal/pool/pool.js [app-route] (ecmascript)"));
exports.Pool = pool_1.default;
exports.default = pool_1.default;
}),
"[project]/frontend/node_modules/neo4j-driver-core/lib/internal/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/**
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [https://neo4j.com]
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ var __createBinding = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__createBinding || (Object.create ? function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = {
            enumerable: true,
            get: function() {
                return m[k];
            }
        };
    }
    Object.defineProperty(o, k2, desc);
} : function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
});
var __setModuleDefault = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__setModuleDefault || (Object.create ? function(o, v) {
    Object.defineProperty(o, "default", {
        enumerable: true,
        value: v
    });
} : function(o, v) {
    o["default"] = v;
});
var __importStar = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__importStar || function() {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function(o) {
            var ar = [];
            for(var k in o)if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function(mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) {
            for(var k = ownKeys(mod), i = 0; i < k.length; i++)if (k[i] !== "default") __createBinding(result, mod, k[i]);
        }
        __setModuleDefault(result, mod);
        return result;
    };
}();
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.pool = exports.boltAgent = exports.objectUtil = exports.resolver = exports.serverAddress = exports.urlUtil = exports.logger = exports.transactionExecutor = exports.txConfig = exports.connectionHolder = exports.constants = exports.bookmarks = exports.observer = exports.temporalUtil = exports.util = void 0;
var util = __importStar(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/internal/util.js [app-route] (ecmascript)"));
exports.util = util;
var temporalUtil = __importStar(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/internal/temporal-util.js [app-route] (ecmascript)"));
exports.temporalUtil = temporalUtil;
var observer = __importStar(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/internal/observers.js [app-route] (ecmascript)"));
exports.observer = observer;
var bookmarks = __importStar(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/internal/bookmarks.js [app-route] (ecmascript)"));
exports.bookmarks = bookmarks;
var constants = __importStar(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/internal/constants.js [app-route] (ecmascript)"));
exports.constants = constants;
var connectionHolder = __importStar(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/internal/connection-holder.js [app-route] (ecmascript)"));
exports.connectionHolder = connectionHolder;
var txConfig = __importStar(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/internal/tx-config.js [app-route] (ecmascript)"));
exports.txConfig = txConfig;
var transactionExecutor = __importStar(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/internal/transaction-executor.js [app-route] (ecmascript)"));
exports.transactionExecutor = transactionExecutor;
var logger = __importStar(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/internal/logger.js [app-route] (ecmascript)"));
exports.logger = logger;
var urlUtil = __importStar(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/internal/url-util.js [app-route] (ecmascript)"));
exports.urlUtil = urlUtil;
var serverAddress = __importStar(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/internal/server-address.js [app-route] (ecmascript)"));
exports.serverAddress = serverAddress;
var resolver = __importStar(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/internal/resolver/index.js [app-route] (ecmascript)"));
exports.resolver = resolver;
var objectUtil = __importStar(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/internal/object-util.js [app-route] (ecmascript)"));
exports.objectUtil = objectUtil;
var boltAgent = __importStar(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/internal/bolt-agent/index.js [app-route] (ecmascript)"));
exports.boltAgent = boltAgent;
var pool = __importStar(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/internal/pool/index.js [app-route] (ecmascript)"));
exports.pool = pool;
}),
"[project]/frontend/node_modules/neo4j-driver-core/lib/notification.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __assign = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__assign || function() {
    __assign = Object.assign || function(t) {
        for(var s, i = 1, n = arguments.length; i < n; i++){
            s = arguments[i];
            for(var p in s)if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __createBinding = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__createBinding || (Object.create ? function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = {
            enumerable: true,
            get: function() {
                return m[k];
            }
        };
    }
    Object.defineProperty(o, k2, desc);
} : function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
});
var __setModuleDefault = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__setModuleDefault || (Object.create ? function(o, v) {
    Object.defineProperty(o, "default", {
        enumerable: true,
        value: v
    });
} : function(o, v) {
    o["default"] = v;
});
var __importStar = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__importStar || function() {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function(o) {
            var ar = [];
            for(var k in o)if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function(mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) {
            for(var k = ownKeys(mod), i = 0; i < k.length; i++)if (k[i] !== "default") __createBinding(result, mod, k[i]);
        }
        __setModuleDefault(result, mod);
        return result;
    };
}();
var __read = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__read || function(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while((n === void 0 || n-- > 0) && !(r = i.next()).done)ar.push(r.value);
    } catch (error) {
        e = {
            error: error
        };
    } finally{
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        } finally{
            if (e) throw e.error;
        }
    }
    return ar;
};
var __spreadArray = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__spreadArray || function(to, from, pack) {
    if (pack || arguments.length === 2) for(var i = 0, l = from.length, ar; i < l; i++){
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.GqlStatusObject = exports.Notification = exports.notificationClassification = exports.notificationCategory = exports.notificationSeverityLevel = void 0;
exports.polyfillGqlStatusObject = polyfillGqlStatusObject;
exports.polyfillNotification = polyfillNotification;
exports.buildGqlStatusObjectFromMetadata = buildGqlStatusObjectFromMetadata;
exports.buildNotificationsFromMetadata = buildNotificationsFromMetadata;
/**
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [https://neo4j.com]
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ var json = __importStar(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/json.js [app-route] (ecmascript)"));
var internal_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/internal/index.js [app-route] (ecmascript)");
var gql_constants_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/gql-constants.js [app-route] (ecmascript)");
var unknownGqlStatus = {
    WARNING: {
        gql_status: '01N42',
        status_description: 'warn: unknown warning'
    },
    NO_DATA: {
        gql_status: '02N42',
        status_description: 'note: no data - unknown subcondition'
    },
    INFORMATION: {
        gql_status: '03N42',
        status_description: 'info: unknown notification'
    },
    ERROR: {
        gql_status: '50N42',
        status_description: 'error: general processing exception - unexpected error'
    }
};
/**
 * @typedef {'WARNING' | 'INFORMATION' | 'UNKNOWN'} NotificationSeverityLevel
 */ /**
 * Constants that represents the Severity level in the {@link GqlStatusObject}
 */ var notificationSeverityLevel = {
    WARNING: 'WARNING',
    INFORMATION: 'INFORMATION',
    UNKNOWN: 'UNKNOWN'
};
exports.notificationSeverityLevel = notificationSeverityLevel;
Object.freeze(notificationSeverityLevel);
var severityLevels = Object.values(notificationSeverityLevel);
/**
 * @typedef {'HINT' | 'UNRECOGNIZED' | 'UNSUPPORTED' |'PERFORMANCE' | 'TOPOLOGY' | 'SECURITY' | 'DEPRECATION' | 'GENERIC' | 'SCHEMA' | 'UNKNOWN' } NotificationCategory
 */ /**
 * Constants that represents the Category in the {@link Notification}
 * @deprecated use {@link notificationClassification} instead.
 */ var notificationCategory = {
    HINT: 'HINT',
    UNRECOGNIZED: 'UNRECOGNIZED',
    UNSUPPORTED: 'UNSUPPORTED',
    PERFORMANCE: 'PERFORMANCE',
    DEPRECATION: 'DEPRECATION',
    TOPOLOGY: 'TOPOLOGY',
    SECURITY: 'SECURITY',
    GENERIC: 'GENERIC',
    SCHEMA: 'SCHEMA',
    UNKNOWN: 'UNKNOWN'
};
exports.notificationCategory = notificationCategory;
Object.freeze(notificationCategory);
var categories = Object.values(notificationCategory);
/**
 * @typedef {NotificationCategory} NotificationClassification
 */ /**
 * Constants that represents the Classification in the {@link GqlStatusObject}
 * @type {notificationCategory}
 */ var notificationClassification = notificationCategory;
exports.notificationClassification = notificationClassification;
/**
 * Class for Cypher notifications
 * @access public
 * @deprecated has been superceded by {@link GqlStatusObject}
 */ var Notification = function() {
    /**
     * Create a Notification instance
     * @constructor
     * @param {Object} notification - Object with notification data
     */ function Notification(notification) {
        /**
         * The code
         * @type {string}
         * @public
         */ this.code = notification.code;
        /**
         * The title
         * @type {string}
         * @public
         */ this.title = notification.title;
        /**
         * The description
         * @type {string}
         * @public
         */ this.description = notification.description;
        /**
         * The position which the notification had occur.
         *
         * @type {NotificationPosition}
         * @public
         */ this.position = _constructPosition(notification.position);
        /**
         * The severity level
         *
         * @type {NotificationSeverityLevel}
         * @public
         * @example
         * const { summary } = await session.run("RETURN 1")
         *
         * for (const notification of summary.notifications) {
         *     switch(notification.severityLevel) {
         *         case neo4j.notificationSeverityLevel.INFORMATION: // or simply 'INFORMATION'
         *             console.info(`${notification.title} - ${notification.description}`)
         *             break
         *         case neo4j.notificationSeverityLevel.WARNING: // or simply 'WARNING'
         *             console.warn(`${notification.title} - ${notification.description}`)
         *             break
         *         case neo4j.notificationSeverityLevel.UNKNOWN: // or simply 'UNKNOWN'
         *         default:
         *             // the raw info came from the server could be found at notification.rawSeverityLevel
         *             console.log(`${notification.title} - ${notification.description}`)
         *             break
         *     }
         * }
         */ this.severityLevel = _asEnumerableSeverity(notification.severity);
        /**
         * The severity level returned by the server without any validation.
         *
         * @type {string}
         * @public
         */ this.rawSeverityLevel = notification.severity;
        /**
         * The category
         *
         * @type {NotificationCategory}
         * @public
         * @example
         * const { summary } = await session.run("RETURN 1")
         *
         * for (const notification of summary.notifications) {
         *     switch(notification.category) {
         *         case neo4j.notificationCategory.QUERY: // or simply 'QUERY'
         *             console.info(`${notification.title} - ${notification.description}`)
         *             break
         *         case neo4j.notificationCategory.PERFORMANCE: // or simply 'PERFORMANCE'
         *             console.warn(`${notification.title} - ${notification.description}`)
         *             break
         *         case neo4j.notificationCategory.UNKNOWN: // or simply 'UNKNOWN'
         *         default:
         *             // the raw info came from the server could be found at notification.rawCategory
         *             console.log(`${notification.title} - ${notification.description}`)
         *             break
         *     }
         * }
         */ this.category = _asEnumerableClassification(notification.category);
        /**
         * The category returned by the server without any validation.
         *
         * @type {string|undefined}
         * @public
         */ this.rawCategory = notification.category;
    }
    return Notification;
}();
exports.Notification = Notification;
/**
 * Representation for GqlStatusObject found when executing a query.
 * <p>
 * This object represents a status of query execution.
 *
 * @public
 */ var GqlStatusObject = function() {
    /**
     *
     * @param rawGqlStatusObject
     * @private
     */ function GqlStatusObject(rawGqlStatusObject) {
        var _a;
        /**
         * The GQLSTATUS
         *
         * @type {string}
         * @public
         */ this.gqlStatus = rawGqlStatusObject.gql_status;
        /**
         * The GQLSTATUS description
         *
         * @type {string}
         * @public
         */ this.statusDescription = rawGqlStatusObject.status_description;
        /**
         * The diagnostic record as it is.
         *
         * @type {object}
         * @public
         */ this.diagnosticRecord = (_a = rawGqlStatusObject.diagnostic_record) !== null && _a !== void 0 ? _a : {};
        /**
         * The position at which the notification had occurred.
         *
         * @type {NotificationPosition | undefined}
         * @public
         */ this.position = this.diagnosticRecord._position != null ? _constructPosition(this.diagnosticRecord._position) : undefined;
        /**
         * The severity
         *
         * @type {NotificationSeverityLevel}
         * @public
         * @example
         * const { summary } = await session.run("RETURN 1")
         *
         * for (const gqlStatusObject of summary.gqlStatusObjects) {
         *     switch(gqlStatusObject.severity) {
         *         case neo4j.notificationSeverityLevel.INFORMATION: // or simply 'INFORMATION'
         *             console.info(gqlStatusObject.statusDescription)
         *             break
         *         case neo4j.notificationSeverityLevel.WARNING: // or simply 'WARNING'
         *             console.warn(gqlStatusObject.statusDescription)
         *             break
         *         case neo4j.notificationSeverityLevel.UNKNOWN: // or simply 'UNKNOWN'
         *         default:
         *             // the raw info came from the server could be found at gqlStatusObject.rawSeverity
         *             console.log(gqlStatusObject.statusDescription)
         *             break
         *     }
         * }
         */ this.severity = _asEnumerableSeverity(this.diagnosticRecord._severity);
        /**
         * The severity returned in the diagnostic record from the server without any validation.
         *
         * @type {string | undefined}
         * @public
         */ this.rawSeverity = this.diagnosticRecord._severity;
        /**
         * The classification
         *
         * @type {NotificationClassification}
         * @public
         * @example
         * const { summary } = await session.run("RETURN 1")
         *
         * for (const gqlStatusObject of summary.gqlStatusObjects) {
         *     switch(gqlStatusObject.classification) {
         *         case neo4j.notificationClassification.QUERY: // or simply 'QUERY'
         *             console.info(gqlStatusObject.statusDescription)
         *             break
         *         case neo4j.notificationClassification.PERFORMANCE: // or simply 'PERFORMANCE'
         *             console.warn(gqlStatusObject.statusDescription)
         *             break
         *         case neo4j.notificationClassification.UNKNOWN: // or simply 'UNKNOWN'
         *         default:
         *             // the raw info came from the server can be found at notification.rawCategory
         *             console.log(gqlStatusObject.statusDescription)
         *             break
         *     }
         * }
         */ this.classification = _asEnumerableClassification(this.diagnosticRecord._classification);
        /**
         * The category returned by the server without any validation.
         *
         * @type {string|undefined}
         * @public
         */ this.rawClassification = this.diagnosticRecord._classification;
        /**
         * Indicates if this object represents a notification and it can be filtered using
         * NotificationFilter.
         *
         * Only GqlStatusObject which is Notification has meaningful position, severity and
         * classification.
         *
         * @type {boolean}
         * @public
         */ this.isNotification = rawGqlStatusObject.neo4j_code != null;
        Object.freeze(this);
    }
    Object.defineProperty(GqlStatusObject.prototype, "diagnosticRecordAsJsonString", {
        /**
         * The json string representation of the diagnostic record.
         * The goal of this method is provide a serialized object for human inspection.
         *
         * @type {string}
         * @public
         */ get: function() {
            return json.stringify(this.diagnosticRecord, {
                useCustomToString: true
            });
        },
        enumerable: false,
        configurable: true
    });
    return GqlStatusObject;
}();
exports.GqlStatusObject = GqlStatusObject;
/**
 *
 * @private
 * @param status
 * @returns {Notification|undefined}
 */ function polyfillNotification(status) {
    var _a, _b, _c;
    // Non notification status should have neo4j_code
    if (status.neo4j_code == null) {
        return undefined;
    }
    return new Notification({
        code: status.neo4j_code,
        title: status.title,
        description: status.description,
        severity: (_a = status.diagnostic_record) === null || _a === void 0 ? void 0 : _a._severity,
        category: (_b = status.diagnostic_record) === null || _b === void 0 ? void 0 : _b._classification,
        position: (_c = status.diagnostic_record) === null || _c === void 0 ? void 0 : _c._position
    });
}
/**
 * @private
 * @param notification
 * @returns {GqlStatusObject}
 */ function polyfillGqlStatusObject(notification) {
    var _a;
    var defaultStatus = notification.severity === notificationSeverityLevel.WARNING ? unknownGqlStatus.WARNING : unknownGqlStatus.INFORMATION;
    var polyfilledRawObj = {
        gql_status: defaultStatus.gql_status,
        status_description: (_a = notification.description) !== null && _a !== void 0 ? _a : defaultStatus.status_description,
        neo4j_code: notification.code,
        title: notification.title,
        diagnostic_record: __assign({}, gql_constants_1.rawPolyfilledDiagnosticRecord)
    };
    if (notification.severity != null) {
        polyfilledRawObj.diagnostic_record._severity = notification.severity;
    }
    if (notification.category != null) {
        polyfilledRawObj.diagnostic_record._classification = notification.category;
    }
    if (notification.position != null) {
        polyfilledRawObj.diagnostic_record._position = notification.position;
    }
    return new GqlStatusObject(polyfilledRawObj);
}
/**
 * This objects are used for polyfilling the first status on the status list
 *
 * @private
 */ var staticGqlStatusObjects = {
    SUCCESS: new GqlStatusObject({
        gql_status: '00000',
        status_description: 'note: successful completion',
        diagnostic_record: gql_constants_1.rawPolyfilledDiagnosticRecord
    }),
    NO_DATA: new GqlStatusObject({
        gql_status: '02000',
        status_description: 'note: no data',
        diagnostic_record: gql_constants_1.rawPolyfilledDiagnosticRecord
    }),
    NO_DATA_UNKNOWN_SUBCONDITION: new GqlStatusObject(__assign(__assign({}, unknownGqlStatus.NO_DATA), {
        diagnostic_record: gql_constants_1.rawPolyfilledDiagnosticRecord
    })),
    OMITTED_RESULT: new GqlStatusObject({
        gql_status: '00001',
        status_description: 'note: successful completion - omitted result',
        diagnostic_record: gql_constants_1.rawPolyfilledDiagnosticRecord
    })
};
Object.freeze(staticGqlStatusObjects);
/**
 *
 * @private
 * @param metadata
 * @returns
 */ function buildGqlStatusObjectFromMetadata(metadata) {
    var _a, _b;
    function getGqlStatusObjectFromStreamSummary(summary) {
        if ((summary === null || summary === void 0 ? void 0 : summary.have_records_streamed) === true) {
            return staticGqlStatusObjects.SUCCESS;
        }
        if ((summary === null || summary === void 0 ? void 0 : summary.has_keys) === false) {
            return staticGqlStatusObjects.OMITTED_RESULT;
        }
        if ((summary === null || summary === void 0 ? void 0 : summary.pulled) === true) {
            return staticGqlStatusObjects.NO_DATA;
        }
        return staticGqlStatusObjects.NO_DATA_UNKNOWN_SUBCONDITION;
    }
    if (metadata.statuses != null) {
        return metadata.statuses.map(function(status) {
            return new GqlStatusObject(status);
        });
    }
    var clientGenerated = getGqlStatusObjectFromStreamSummary(metadata.stream_summary);
    var polyfilledObjects = __spreadArray([
        clientGenerated
    ], __read((_b = (_a = metadata.notifications) === null || _a === void 0 ? void 0 : _a.map(polyfillGqlStatusObject)) !== null && _b !== void 0 ? _b : []), false);
    return polyfilledObjects.sort(function(a, b) {
        return calculateWeight(a) - calculateWeight(b);
    });
}
var gqlStatusWeightByClass = Object.freeze({
    '02': 0,
    '01': 1,
    '00': 2
});
/**
 * GqlStatus weight
 *
 * @private
 */ function calculateWeight(gqlStatusObject) {
    var _a, _b;
    var gqlClass = (_a = gqlStatusObject.gqlStatus) === null || _a === void 0 ? void 0 : _a.slice(0, 2);
    // @ts-expect-error
    return (_b = gqlStatusWeightByClass[gqlClass]) !== null && _b !== void 0 ? _b : 9999;
}
/**
 *
 * @private
 * @param metadata
 * @returns
 */ function buildNotificationsFromMetadata(metadata) {
    if (metadata.notifications != null) {
        return metadata.notifications.map(function(n) {
            return new Notification(n);
        });
    }
    if (metadata.statuses != null) {
        return metadata.statuses.map(polyfillNotification).filter(function(n) {
            return n != null;
        });
    }
    return [];
}
/**
 *
 * @private
 * @param pos
 * @returns {NotificationPosition}
 */ function _constructPosition(pos) {
    if (pos == null) {
        return {};
    }
    /* eslint-disable @typescript-eslint/no-non-null-assertion */ return {
        offset: internal_1.util.toNumber(pos.offset),
        line: internal_1.util.toNumber(pos.line),
        column: internal_1.util.toNumber(pos.column)
    };
/* eslint-enable @typescript-eslint/no-non-null-assertion */ }
function _asEnumerableSeverity(severity) {
    return severityLevels.includes(severity) ? severity : notificationSeverityLevel.UNKNOWN;
}
function _asEnumerableClassification(classification) {
    return categories.includes(classification) ? classification : notificationClassification.UNKNOWN;
}
exports.default = GqlStatusObject;
}),
"[project]/frontend/node_modules/neo4j-driver-core/lib/result-summary.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/**
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [https://neo4j.com]
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Stats = exports.QueryStatistics = exports.ProfiledPlan = exports.Plan = exports.ServerInfo = exports.queryType = void 0;
var internal_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/internal/index.js [app-route] (ecmascript)");
var notification_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/notification.js [app-route] (ecmascript)");
/**
 * A ResultSummary instance contains structured metadata for a {@link Result}.
 * @access public
 */ var ResultSummary = function() {
    /**
     * @constructor
     * @param {string} query - The query this summary is for
     * @param {Object} parameters - Parameters for the query
     * @param {Object} metadata - Query metadata
     * @param {ProtocolVersion|undefined} protocolVersion - Bolt Protocol Version
     */ function ResultSummary(query, parameters, metadata, protocolVersion) {
        var _a, _b, _c;
        /**
         * The query and parameters this summary is for.
         * @type {{text: string, parameters: Object}}
         * @public
         */ this.query = {
            text: query,
            parameters: parameters
        };
        /**
         * The type of query executed. Can be "r" for read-only query, "rw" for read-write query,
         * "w" for write-only query and "s" for schema-write query.
         * String constants are available in {@link queryType} object.
         * @type {string}
         * @public
         */ this.queryType = metadata.type;
        /**
         * Counters for operations the query triggered.
         * @type {QueryStatistics}
         * @public
         */ this.counters = new QueryStatistics((_a = metadata.stats) !== null && _a !== void 0 ? _a : {});
        // for backwards compatibility, remove in future version
        /**
         * This describes how the database will execute the query.
         * Query plan for the executed query if available, otherwise undefined.
         * Will only be populated for queries that start with "EXPLAIN".
         * @type {Plan|false}
         * @public
         */ this.plan = metadata.plan != null || metadata.profile != null ? new Plan((_b = metadata.plan) !== null && _b !== void 0 ? _b : metadata.profile) : false;
        /**
         * This describes how the database did execute your query. This will contain detailed information about what
         * each step of the plan did. Profiled query plan for the executed query if available, otherwise undefined.
         * Will only be populated for queries that start with "PROFILE".
         * @type {ProfiledPlan}
         * @public
         */ this.profile = metadata.profile != null ? new ProfiledPlan(metadata.profile) : false;
        /**
         * An array of notifications that might arise when executing the query. Notifications can be warnings about
         * problematic queries or other valuable information that can be presented in a client. Unlike failures
         * or errors, notifications do not affect the execution of a query.
         * @type {Array<Notification>}
         * @public
         * @deprecated has been superceded by {@link ResultSummary.gqlStatusObjects}
         */ this.notifications = (0, notification_1.buildNotificationsFromMetadata)(metadata);
        /**
         * A list of GqlStatusObjects that arise when executing the query.
         *
         * The list always contains at least 1 status representing the Success, No Data or Omitted Result.
         *
         * When discarding records while connected to a non-gql aware server and using a RxSession,
         * the driver might not be able to tell apart Success and No Data.
         *
         * All other status are notifications like warnings about problematic queries or other valuable
         * information that can be presented in a client.
         *
         * The GqlStatusObjects will be presented in the following order:
         *
         * - A “no data” (02xxx) has precedence over a warning;
         * - A warning (01xxx) has precedence over a success.
         * - A success (00xxx) has precedence over anything informational (03xxx)
         *
         * @type {Array<GqlStatusObject>}
         * @public
         */ this.gqlStatusObjects = (0, notification_1.buildGqlStatusObjectFromMetadata)(metadata);
        /**
         * The basic information of the server where the result is obtained from.
         * @type {ServerInfo}
         * @public
         */ this.server = new ServerInfo(metadata.server, protocolVersion);
        /**
         * The time it took the server to consume the result.
         * @type {number}
         * @public
         */ this.resultConsumedAfter = metadata.result_consumed_after;
        /**
         * The time it took the server to make the result available for consumption in milliseconds.
         * @type {number}
         * @public
         */ this.resultAvailableAfter = metadata.result_available_after;
        /**
         * The database name where this summary is obtained from.
         * @type {{name: string}}
         * @public
         */ this.database = {
            name: (_c = metadata.db) !== null && _c !== void 0 ? _c : null
        };
    }
    /**
     * Check if the result summary has a plan
     * @return {boolean}
     */ ResultSummary.prototype.hasPlan = function() {
        return this.plan instanceof Plan;
    };
    /**
     * Check if the result summary has a profile
     * @return {boolean}
     */ ResultSummary.prototype.hasProfile = function() {
        return this.profile instanceof ProfiledPlan;
    };
    return ResultSummary;
}();
/**
 * Class for execution plan received by prepending Cypher with EXPLAIN.
 * @access public
 */ var Plan = function() {
    /**
     * Create a Plan instance
     * @constructor
     * @param {Object} plan - Object with plan data
     */ function Plan(plan) {
        this.operatorType = plan.operatorType;
        this.identifiers = plan.identifiers;
        this.arguments = plan.args;
        this.children = plan.children != null ? plan.children.map(function(child) {
            return new Plan(child);
        }) : [];
    }
    return Plan;
}();
exports.Plan = Plan;
/**
 * Class for execution plan received by prepending Cypher with PROFILE.
 * @access public
 */ var ProfiledPlan = function() {
    /**
     * Create a ProfiledPlan instance
     * @constructor
     * @param {Object} profile - Object with profile data
     */ function ProfiledPlan(profile) {
        this.operatorType = profile.operatorType;
        this.identifiers = profile.identifiers;
        this.arguments = profile.args;
        this.dbHits = valueOrDefault('dbHits', profile);
        this.rows = valueOrDefault('rows', profile);
        this.pageCacheMisses = valueOrDefault('pageCacheMisses', profile);
        this.pageCacheHits = valueOrDefault('pageCacheHits', profile);
        this.pageCacheHitRatio = valueOrDefault('pageCacheHitRatio', profile);
        this.time = valueOrDefault('time', profile);
        this.children = profile.children != null ? profile.children.map(function(child) {
            return new ProfiledPlan(child);
        }) : [];
    }
    ProfiledPlan.prototype.hasPageCacheStats = function() {
        return this.pageCacheMisses > 0 || this.pageCacheHits > 0 || this.pageCacheHitRatio > 0;
    };
    return ProfiledPlan;
}();
exports.ProfiledPlan = ProfiledPlan;
/**
 * Stats Query statistics dictionary for a {@link QueryStatistics}
 * @public
 */ var Stats = function() {
    /**
     * @constructor
     * @private
     */ function Stats() {
        /**
         * nodes created
         * @type {number}
         * @public
         */ this.nodesCreated = 0;
        /**
         * nodes deleted
         * @type {number}
         * @public
         */ this.nodesDeleted = 0;
        /**
         * relationships created
         * @type {number}
         * @public
         */ this.relationshipsCreated = 0;
        /**
         * relationships deleted
         * @type {number}
         * @public
         */ this.relationshipsDeleted = 0;
        /**
         * properties set
         * @type {number}
         * @public
         */ this.propertiesSet = 0;
        /**
         * labels added
         * @type {number}
         * @public
         */ this.labelsAdded = 0;
        /**
         * labels removed
         * @type {number}
         * @public
         */ this.labelsRemoved = 0;
        /**
         * indexes added
         * @type {number}
         * @public
         */ this.indexesAdded = 0;
        /**
         * indexes removed
         * @type {number}
         * @public
         */ this.indexesRemoved = 0;
        /**
         * constraints added
         * @type {number}
         * @public
         */ this.constraintsAdded = 0;
        /**
         * constraints removed
         * @type {number}
         * @public
         */ this.constraintsRemoved = 0;
    }
    return Stats;
}();
exports.Stats = Stats;
/**
 * Get statistical information for a {@link Result}.
 * @access public
 */ var QueryStatistics = function() {
    /**
     * Structurize the statistics
     * @constructor
     * @param {Object} statistics - Result statistics
     */ function QueryStatistics(statistics) {
        var _this = this;
        this._stats = {
            nodesCreated: 0,
            nodesDeleted: 0,
            relationshipsCreated: 0,
            relationshipsDeleted: 0,
            propertiesSet: 0,
            labelsAdded: 0,
            labelsRemoved: 0,
            indexesAdded: 0,
            indexesRemoved: 0,
            constraintsAdded: 0,
            constraintsRemoved: 0
        };
        this._systemUpdates = 0;
        Object.keys(statistics).forEach(function(index) {
            // To camelCase
            var camelCaseIndex = index.replace(/(-\w)/g, function(m) {
                return m[1].toUpperCase();
            });
            if (camelCaseIndex in _this._stats) {
                _this._stats[camelCaseIndex] = internal_1.util.toNumber(statistics[index]);
            } else if (camelCaseIndex === 'systemUpdates') {
                _this._systemUpdates = internal_1.util.toNumber(statistics[index]);
            } else if (camelCaseIndex === 'containsSystemUpdates') {
                _this._containsSystemUpdates = statistics[index];
            } else if (camelCaseIndex === 'containsUpdates') {
                _this._containsUpdates = statistics[index];
            }
        });
        this._stats = Object.freeze(this._stats);
    }
    /**
     * Did the database get updated?
     * @return {boolean}
     */ QueryStatistics.prototype.containsUpdates = function() {
        var _this = this;
        return this._containsUpdates !== undefined ? this._containsUpdates : Object.keys(this._stats).reduce(function(last, current) {
            return last + _this._stats[current];
        }, 0) > 0;
    };
    /**
     * Returns the query statistics updates in a dictionary.
     * @returns {Stats}
     */ QueryStatistics.prototype.updates = function() {
        return this._stats;
    };
    /**
     * Return true if the system database get updated, otherwise false
     * @returns {boolean} - If the system database get updated or not.
     */ QueryStatistics.prototype.containsSystemUpdates = function() {
        return this._containsSystemUpdates !== undefined ? this._containsSystemUpdates : this._systemUpdates > 0;
    };
    /**
     * @returns {number} - Number of system updates
     */ QueryStatistics.prototype.systemUpdates = function() {
        return this._systemUpdates;
    };
    return QueryStatistics;
}();
exports.QueryStatistics = QueryStatistics;
/**
 * Class for exposing server info from a result.
 * @access public
 */ var ServerInfo = function() {
    /**
     * Create a ServerInfo instance
     * @constructor
     * @param {Object} serverMeta - Object with serverMeta data
     * @param {Object} connectionInfo - Bolt connection info
     * @param {ProtocolVersion} protocolVersion - Bolt Protocol Version
     */ function ServerInfo(serverMeta, protocolVersion) {
        if (serverMeta != null) {
            /**
             * The server adress
             * @type {string}
             * @public
             */ this.address = serverMeta.address;
            /**
             * The server user agent string
             * @type {string}
             * @public
             */ this.agent = serverMeta.version;
        }
        /**
         * The protocol version used by the connection
         * @type {ProtocolVersion}
         * @public
         */ this.protocolVersion = protocolVersion;
    }
    return ServerInfo;
}();
exports.ServerInfo = ServerInfo;
function valueOrDefault(key, values, defaultValue) {
    if (defaultValue === void 0) {
        defaultValue = 0;
    }
    if (values !== false && key in values) {
        var value = values[key];
        return internal_1.util.toNumber(value);
    } else {
        return defaultValue;
    }
}
/**
 * The constants for query types
 * @type {{SCHEMA_WRITE: string, WRITE_ONLY: string, READ_ONLY: string, READ_WRITE: string}}
 */ var queryType = {
    READ_ONLY: 'r',
    READ_WRITE: 'rw',
    WRITE_ONLY: 'w',
    SCHEMA_WRITE: 's'
};
exports.queryType = queryType;
exports.default = ResultSummary;
}),
"[project]/frontend/node_modules/neo4j-driver-core/lib/notification-filter.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.notificationFilterDisabledClassification = exports.notificationFilterDisabledCategory = exports.notificationFilterMinimumSeverityLevel = void 0;
/**
 * @typedef {'WARNING' | 'INFORMATION' | 'OFF'} NotificationFilterMinimumSeverityLevel
 */ /**
 * Constants that represents the minimum Severity level in the {@link NotificationFilter}
 */ var notificationFilterMinimumSeverityLevel = {
    OFF: 'OFF',
    WARNING: 'WARNING',
    INFORMATION: 'INFORMATION'
};
exports.notificationFilterMinimumSeverityLevel = notificationFilterMinimumSeverityLevel;
Object.freeze(notificationFilterMinimumSeverityLevel);
/**
 * @typedef {'HINT' | 'UNRECOGNIZED' | 'UNSUPPORTED' |'PERFORMANCE' | 'TOPOLOGY' | 'SECURITY' | 'DEPRECATION' | 'GENERIC' | 'SCHEMA'} NotificationFilterDisabledCategory
 */ /**
 * Constants that represents the disabled categories in the {@link NotificationFilter}
 * @deprecated use {@link notificationFilterDisabledClassification} instead.
 */ var notificationFilterDisabledCategory = {
    HINT: 'HINT',
    UNRECOGNIZED: 'UNRECOGNIZED',
    UNSUPPORTED: 'UNSUPPORTED',
    PERFORMANCE: 'PERFORMANCE',
    TOPOLOGY: 'TOPOLOGY',
    SECURITY: 'SECURITY',
    DEPRECATION: 'DEPRECATION',
    GENERIC: 'GENERIC',
    SCHEMA: 'SCHEMA'
};
exports.notificationFilterDisabledCategory = notificationFilterDisabledCategory;
Object.freeze(notificationFilterDisabledCategory);
/**
 * @typedef {NotificationFilterDisabledCategory} NotificationFilterDisabledClassification
 */ /**
 * Constants that represents the disabled classifications in the {@link NotificationFilter}
 *
 * @type {NotificationFilterDisabledClassification}
 */ var notificationFilterDisabledClassification = notificationFilterDisabledCategory;
exports.notificationFilterDisabledClassification = notificationFilterDisabledClassification;
/**
 * The notification filter object which can be configured in
 * the session and driver creation.
 *
 * Values not defined are interpreted as default.
 *
 * @interface
 */ var NotificationFilter = function() {
    /**
     * @constructor
     * @private
     */ function NotificationFilter() {
        /**
         * The minimum level of all notifications to receive.
         *
         * @public
         * @type {?NotificationFilterMinimumSeverityLevel}
         */ this.minimumSeverityLevel = undefined;
        /**
         * Categories the user would like to opt-out of receiving.
         *
         *
         * This property is equivalent to {@link NotificationFilter#disabledClassifications}
         * and it must not be enabled at same time.
         *
         * @type {?NotificationFilterDisabledCategory[]}
         * @deprecated use{@link NotificationFilter#disabledClassifications}
         */ this.disabledCategories = undefined;
        /**
         * Classifications the user would like to opt-out of receiving.
         *
         * This property is equivalent to {@link NotificationFilter#disabledCategories}
         * and it must not be enabled at same time.
         *
         * @type {?NotificationFilterDisabledClassification[]}
         */ this.disabledClassifications = undefined;
        throw new Error('Not implemented');
    }
    return NotificationFilter;
}();
exports.default = NotificationFilter;
}),
"[project]/frontend/node_modules/neo4j-driver-core/lib/result.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/**
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [https://neo4j.com]
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ var __extends = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__extends || function() {
    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || ({
            __proto__: []
        }) instanceof Array && function(d, b) {
            d.__proto__ = b;
        } || function(d, b) {
            for(var p in b)if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
        };
        return extendStatics(d, b);
    };
    return function(d, b) {
        if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
}();
var __awaiter = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__awaiter || function(thisArg, _arguments, P, generator) {
    function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
            resolve(value);
        });
    }
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
                step(generator["throw"](value));
            } catch (e) {
                reject(e);
            }
        }
        function step(result) {
            result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__generator || function(thisArg, body) {
    var _ = {
        label: 0,
        sent: function() {
            if (t[0] & 1) throw t[1];
            return t[1];
        },
        trys: [],
        ops: []
    }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() {
        return this;
    }), g;
    //TURBOPACK unreachable
    ;
    function verb(n) {
        return function(v) {
            return step([
                n,
                v
            ]);
        };
    }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while(g && (g = 0, op[0] && (_ = 0)), _)try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [
                op[0] & 2,
                t.value
            ];
            switch(op[0]){
                case 0:
                case 1:
                    t = op;
                    break;
                case 4:
                    _.label++;
                    return {
                        value: op[1],
                        done: false
                    };
                case 5:
                    _.label++;
                    y = op[1];
                    op = [
                        0
                    ];
                    continue;
                case 7:
                    op = _.ops.pop();
                    _.trys.pop();
                    continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                        _ = 0;
                        continue;
                    }
                    if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                        _.label = op[1];
                        break;
                    }
                    if (op[0] === 6 && _.label < t[1]) {
                        _.label = t[1];
                        t = op;
                        break;
                    }
                    if (t && _.label < t[2]) {
                        _.label = t[2];
                        _.ops.push(op);
                        break;
                    }
                    if (t[2]) _.ops.pop();
                    _.trys.pop();
                    continue;
            }
            op = body.call(thisArg, _);
        } catch (e) {
            op = [
                6,
                e
            ];
            y = 0;
        } finally{
            f = t = 0;
        }
        if (op[0] & 5) throw op[1];
        return {
            value: op[0] ? op[1] : void 0,
            done: true
        };
    }
};
var __importDefault = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : {
        "default": mod
    };
};
var _a;
Object.defineProperty(exports, "__esModule", {
    value: true
});
/* eslint-disable @typescript-eslint/promise-function-async */ var result_summary_1 = __importDefault(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/result-summary.js [app-route] (ecmascript)"));
var internal_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/internal/index.js [app-route] (ecmascript)");
var error_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/error.js [app-route] (ecmascript)");
var EMPTY_CONNECTION_HOLDER = internal_1.connectionHolder.EMPTY_CONNECTION_HOLDER;
/**
 * @private
 * @param {Error} error The error
 * @returns {void}
 */ var DEFAULT_ON_ERROR = function(error) {
    // eslint-disable-next-line @typescript-eslint/restrict-plus-operands, @typescript-eslint/no-base-to-string
    console.log('Uncaught error when processing result: ' + error);
};
/**
 * @private
 * @param {ResultSummary} summary
 * @returns {void}
 */ var DEFAULT_ON_COMPLETED = function(summary) {};
/**
 * @private
 * @param {string[]} keys List of keys of the record in the result
 * @return {void}
 */ var DEFAULT_ON_KEYS = function(keys) {};
function captureStacktrace() {
    var error = new Error('');
    if (error.stack != null) {
        return error.stack.replace(/^Error(\n\r)*/, ''); // we don't need the 'Error\n' part, if only it exists
    }
    return null;
}
/**
 * @private
 * @param {Error} error The error
 * @param {string| null} newStack The newStack
 * @returns {void}
 */ function replaceStacktrace(error, newStack) {
    if (newStack != null) {
        // Error.prototype.toString() concatenates error.name and error.message nicely
        // then we add the rest of the stack trace
        // eslint-disable-next-line @typescript-eslint/no-base-to-string
        error.stack = error.toString() + '\n' + newStack;
    }
}
var GenericResult = function() {
    /**
     * Inject the observer to be used.
     * @constructor
     * @access private
     * @param {Promise<observer.ResultStreamObserver>} streamObserverPromise
     * @param {mixed} query - Cypher query to execute
     * @param {Object} parameters - Map with parameters to use in query
     * @param {ConnectionHolder} connectionHolder - to be notified when result is either fully consumed or error happened.
     */ function GenericResult(streamObserverPromise, query, parameters, connectionHolder, watermarks) {
        if (watermarks === void 0) {
            watermarks = {
                high: Number.MAX_VALUE,
                low: Number.MAX_VALUE
            };
        }
        /**
         * Called when finally the result is done
         *
         * *Should not be combined with {@link Result#subscribe} function.*
         * @param {function()|null} onfinally - function when the promise finished
         * @return {Promise} promise.
         */ this[_a] = 'Result';
        this._stack = captureStacktrace();
        this._streamObserverPromise = streamObserverPromise;
        this._p = null;
        this._query = query;
        this._parameters = parameters !== null && parameters !== void 0 ? parameters : {};
        this._connectionHolder = connectionHolder !== null && connectionHolder !== void 0 ? connectionHolder : EMPTY_CONNECTION_HOLDER;
        this._keys = null;
        this._summary = null;
        this._error = null;
        this._mapper = null;
        this._watermarks = watermarks;
    }
    /**
     * Maps the records of this result to a provided type and/or according to provided Rules.
     *
     * NOTE: This modifies the Result object itself, and can not be run on a Result that is already being consumed.
     *
     * @example
     * class Person {
     *  constructor (
     *    public readonly name: string,
     *    public readonly born?: number
     *  ) {}
     * }
     *
     * const personRules: Rules = {
     *  name: rule.asString(),
     *  born: rule.asNumber({ acceptBigInt: true, optional: true })
     * }
     *
     * await session.executeRead(async (tx: Transaction) => {
     * let txres = tx.run(`MATCH (p:Person)-[r:ACTED_IN]->(m:Movie)<-[:ACTED_IN]-(c:Person)
     * WHERE id(p) <> id(c)
     * RETURN p.name as name, p.born as born`).as<Person>(personRules)
     *
     * @param {GenericConstructor<T> | Rules} constructorOrRules
     * @param {Rules} rules
     * @returns {MappedResult<T>}
     */ GenericResult.prototype.as = function(constructorOrRules, rules) {
        if (this._p != null) {
            throw (0, error_1.newError)('Cannot call .as() on a Result that is being consumed');
        }
        // @ts-expect-error
        this._mapper = function(r) {
            return r.as(constructorOrRules, rules);
        };
        // @ts-expect-error
        return this;
    };
    /**
     * Returns a promise for the field keys.
     *
     * *Should not be combined with {@link Result#subscribe} function.*
     *
     * @public
     * @returns {Promise<string[]>} - Field keys, in the order they will appear in records.
     }
     */ GenericResult.prototype.keys = function() {
        var _this = this;
        if (this._keys !== null) {
            return Promise.resolve(this._keys);
        } else if (this._error !== null) {
            return Promise.reject(this._error);
        }
        return new Promise(function(resolve, reject) {
            _this._streamObserverPromise.then(function(observer) {
                return observer.subscribe(_this._decorateObserver({
                    onKeys: function(keys) {
                        return resolve(keys);
                    },
                    onError: function(err) {
                        return reject(err);
                    }
                }));
            }).catch(reject);
        });
    };
    /**
     * Returns a promise for the result summary.
     *
     * *Should not be combined with {@link Result#subscribe} function.*
     *
     * @public
     * @returns {Promise<ResultSummary<T>>} - Result summary.
     *
     */ GenericResult.prototype.summary = function() {
        var _this = this;
        if (this._summary !== null) {
            // This type casting is needed since we are defining the number type of
            // summary in Result template
            return Promise.resolve(this._summary);
        } else if (this._error !== null) {
            return Promise.reject(this._error);
        }
        return new Promise(function(resolve, reject) {
            _this._streamObserverPromise.then(function(o) {
                o.cancel();
                o.subscribe(_this._decorateObserver({
                    // This type casting is needed since we are defining the number type of
                    // summary in Result template
                    onCompleted: function(summary) {
                        return resolve(summary);
                    },
                    onError: function(err) {
                        return reject(err);
                    }
                }));
            }).catch(reject);
        });
    };
    /**
     * Create and return new Promise
     *
     * @private
     * @return {Promise} new Promise.
     */ GenericResult.prototype._getOrCreatePromise = function() {
        var _this = this;
        if (this._p == null) {
            this._p = new Promise(function(resolve, reject) {
                var records = [];
                var observer = {
                    onNext: function(record) {
                        if (_this._mapper != null) {
                            records.push(_this._mapper(record));
                        } else {
                            records.push(record);
                        }
                    },
                    onCompleted: function(summary) {
                        resolve({
                            records: records,
                            summary: summary
                        });
                    },
                    onError: function(error) {
                        reject(error);
                    }
                };
                _this.subscribe(observer);
            });
        }
        return this._p;
    };
    /**
     * Provides a async iterator over the records in the result.
     *
     * *Should not be combined with {@link Result#subscribe} or {@link Result#then} functions.*
     *
     * @public
     * @returns {PeekableAsyncIterator<R, ResultSummary>} The async iterator for the Results
     */ GenericResult.prototype[Symbol.asyncIterator] = function() {
        var _this = this;
        if (!this.isOpen()) {
            var error_2 = (0, error_1.newError)('Result is already consumed');
            return {
                next: function() {
                    return Promise.reject(error_2);
                },
                peek: function() {
                    return Promise.reject(error_2);
                }
            };
        }
        var state = {
            paused: true,
            firstRun: true,
            finished: false
        };
        var controlFlow = function() {
            var _b, _c;
            if (state.streaming == null) {
                return;
            }
            var size = (_c = (_b = state.queuedObserver) === null || _b === void 0 ? void 0 : _b.size) !== null && _c !== void 0 ? _c : 0;
            var queueSizeIsOverHighOrEqualWatermark = size >= _this._watermarks.high;
            var queueSizeIsBellowOrEqualLowWatermark = size <= _this._watermarks.low;
            if (queueSizeIsOverHighOrEqualWatermark && !state.paused) {
                state.paused = true;
                state.streaming.pause();
            } else if (queueSizeIsBellowOrEqualLowWatermark && state.paused || state.firstRun && !queueSizeIsOverHighOrEqualWatermark) {
                state.firstRun = false;
                state.paused = false;
                state.streaming.resume();
            }
        };
        var initializeObserver = function() {
            return __awaiter(_this, void 0, void 0, function() {
                var _b;
                return __generator(this, function(_c) {
                    switch(_c.label){
                        case 0:
                            if (!(state.queuedObserver === undefined)) return [
                                3 /*break*/ ,
                                2
                            ];
                            state.queuedObserver = this._createQueuedResultObserver(controlFlow);
                            _b = state;
                            return [
                                4 /*yield*/ ,
                                this._subscribe(state.queuedObserver, true).catch(function() {
                                    return undefined;
                                })
                            ];
                        case 1:
                            _b.streaming = _c.sent();
                            controlFlow();
                            _c.label = 2;
                        case 2:
                            return [
                                2 /*return*/ ,
                                state.queuedObserver
                            ];
                    }
                });
            });
        };
        var assertSummary = function(summary) {
            if (summary === undefined) {
                throw (0, error_1.newError)('InvalidState: Result stream finished without Summary', error_1.PROTOCOL_ERROR);
            }
            return true;
        };
        return {
            next: function() {
                return __awaiter(_this, void 0, void 0, function() {
                    var queuedObserver, next;
                    return __generator(this, function(_b) {
                        switch(_b.label){
                            case 0:
                                if (state.finished) {
                                    if (assertSummary(state.summary)) {
                                        return [
                                            2 /*return*/ ,
                                            {
                                                done: true,
                                                value: state.summary
                                            }
                                        ];
                                    }
                                }
                                return [
                                    4 /*yield*/ ,
                                    initializeObserver()
                                ];
                            case 1:
                                queuedObserver = _b.sent();
                                return [
                                    4 /*yield*/ ,
                                    queuedObserver.dequeue()
                                ];
                            case 2:
                                next = _b.sent();
                                if (next.done === true) {
                                    state.finished = next.done;
                                    state.summary = next.value;
                                }
                                return [
                                    2 /*return*/ ,
                                    next
                                ];
                        }
                    });
                });
            },
            return: function(value) {
                return __awaiter(_this, void 0, void 0, function() {
                    var queuedObserver, last;
                    var _b;
                    return __generator(this, function(_c) {
                        switch(_c.label){
                            case 0:
                                if (state.finished) {
                                    if (assertSummary(state.summary)) {
                                        return [
                                            2 /*return*/ ,
                                            {
                                                done: true,
                                                value: value !== null && value !== void 0 ? value : state.summary
                                            }
                                        ];
                                    }
                                }
                                (_b = state.streaming) === null || _b === void 0 ? void 0 : _b.cancel();
                                return [
                                    4 /*yield*/ ,
                                    initializeObserver()
                                ];
                            case 1:
                                queuedObserver = _c.sent();
                                return [
                                    4 /*yield*/ ,
                                    queuedObserver.dequeueUntilDone()
                                ];
                            case 2:
                                last = _c.sent();
                                state.finished = true;
                                last.value = value !== null && value !== void 0 ? value : last.value;
                                state.summary = last.value;
                                return [
                                    2 /*return*/ ,
                                    last
                                ];
                        }
                    });
                });
            },
            peek: function() {
                return __awaiter(_this, void 0, void 0, function() {
                    var queuedObserver;
                    return __generator(this, function(_b) {
                        switch(_b.label){
                            case 0:
                                if (state.finished) {
                                    if (assertSummary(state.summary)) {
                                        return [
                                            2 /*return*/ ,
                                            {
                                                done: true,
                                                value: state.summary
                                            }
                                        ];
                                    }
                                }
                                return [
                                    4 /*yield*/ ,
                                    initializeObserver()
                                ];
                            case 1:
                                queuedObserver = _b.sent();
                                return [
                                    4 /*yield*/ ,
                                    queuedObserver.head()
                                ];
                            case 2:
                                return [
                                    2 /*return*/ ,
                                    _b.sent()
                                ];
                        }
                    });
                });
            }
        };
    };
    /**
     * Waits for all results and calls the passed in function with the results.
     *
     * *Should not be combined with {@link Result#subscribe} function.*
     *
     * @param {function(result: {records:Array<Record>, summary: ResultSummary})} onFulfilled - function to be called
     * when finished.
     * @param {function(error: {message:string, code:string})} onRejected - function to be called upon errors.
     * @return {Promise} promise.
     */ GenericResult.prototype.then = function(onFulfilled, onRejected) {
        return this._getOrCreatePromise().then(onFulfilled, onRejected);
    };
    /**
     * Catch errors when using promises.
     *
     * *Should not be combined with {@link Result#subscribe} function.*
     *
     * @param {function(error: Neo4jError)} onRejected - Function to be called upon errors.
     * @return {Promise} promise.
     */ GenericResult.prototype.catch = function(onRejected) {
        return this._getOrCreatePromise().catch(onRejected);
    };
    GenericResult.prototype.finally = function(onfinally) {
        return this._getOrCreatePromise().finally(onfinally);
    };
    /**
     * Stream records to observer as they come in, this is a more efficient method
     * of handling the results, and allows you to handle arbitrarily large results.
     *
     * @param {Object} observer - Observer object
     * @param {function(keys: string[])} observer.onKeys - handle stream head, the field keys.
     * @param {function(record: Record)} observer.onNext - handle records, one by one.
     * @param {function(summary: ResultSummary)} observer.onCompleted - handle stream tail, the result summary.
     * @param {function(error: {message:string, code:string})} observer.onError - handle errors.
     * @return {void}
     */ GenericResult.prototype.subscribe = function(observer) {
        this._subscribe(observer).catch(function() {});
    };
    /**
     * Check if this result is active, i.e., neither a summary nor an error has been received by the result.
     * @return {boolean} `true` when neither a summary or nor an error has been received by the result.
     */ GenericResult.prototype.isOpen = function() {
        return this._summary === null && this._error === null;
    };
    /**
     * Stream records to observer as they come in, this is a more efficient method
     * of handling the results, and allows you to handle arbitrarily large results.
     *
     * @access private
     * @param {GenericResultObserver} observer The observer to send records to.
     * @param {boolean} paused The flag to indicate if the stream should be started paused
     * @returns {Promise<observer.ResultStreamObserver>} The result stream observer.
     */ GenericResult.prototype._subscribe = function(observer, paused) {
        if (paused === void 0) {
            paused = false;
        }
        var _observer = this._decorateObserver(observer);
        return this._streamObserverPromise.then(function(o) {
            if (paused) {
                o.pause();
            }
            o.subscribe(_observer);
            return o;
        }).catch(function(error) {
            if (_observer.onError != null) {
                _observer.onError(error);
            }
            return Promise.reject(error);
        });
    };
    /**
     * Decorates the ResultObserver with the necessary methods.
     *
     * @access private
     * @param {ResultObserver} observer The ResultObserver to decorate.
     * @returns The decorated result observer
     */ GenericResult.prototype._decorateObserver = function(observer) {
        var _this = this;
        var _b, _c, _d;
        var onCompletedOriginal = (_b = observer.onCompleted) !== null && _b !== void 0 ? _b : DEFAULT_ON_COMPLETED;
        var onErrorOriginal = (_c = observer.onError) !== null && _c !== void 0 ? _c : DEFAULT_ON_ERROR;
        var onKeysOriginal = (_d = observer.onKeys) !== null && _d !== void 0 ? _d : DEFAULT_ON_KEYS;
        var onCompletedWrapper = function(metadata) {
            _this._releaseConnectionAndGetSummary(metadata).then(function(summary) {
                if (_this._summary !== null) {
                    return onCompletedOriginal.call(observer, _this._summary);
                }
                _this._summary = summary;
                return onCompletedOriginal.call(observer, summary);
            }).catch(onErrorOriginal);
        };
        var onErrorWrapper = function(error) {
            // notify connection holder that the used connection is not needed any more because error happened
            // and result can't bee consumed any further; call the original onError callback after that
            _this._connectionHolder.releaseConnection().then(function() {
                replaceStacktrace(error, _this._stack);
                _this._error = error;
                onErrorOriginal.call(observer, error);
            }).catch(onErrorOriginal);
        };
        var onKeysWrapper = function(keys) {
            _this._keys = keys;
            return onKeysOriginal.call(observer, keys);
        };
        return {
            onNext: observer.onNext != null ? observer.onNext.bind(observer) : undefined,
            onKeys: onKeysWrapper,
            onCompleted: onCompletedWrapper,
            onError: onErrorWrapper
        };
    };
    /**
     * Signals the stream observer that the future records should be discarded on the server.
     *
     * @protected
     * @since 4.0.0
     * @returns {void}
     */ GenericResult.prototype._cancel = function() {
        if (this._summary === null && this._error === null) {
            this._streamObserverPromise.then(function(o) {
                return o.cancel();
            }).catch(function() {});
        }
    };
    /**
     * @access private
     * @param metadata
     * @returns
     */ GenericResult.prototype._releaseConnectionAndGetSummary = function(metadata) {
        var _b = internal_1.util.validateQueryAndParameters(this._query, this._parameters, {
            skipAsserts: true
        }), query = _b.validatedQuery, parameters = _b.params;
        var connectionHolder = this._connectionHolder;
        return connectionHolder.getConnection().then(// onFulfilled:
        function(connection) {
            return connectionHolder.releaseConnection().then(function() {
                return connection === null || connection === void 0 ? void 0 : connection.getProtocolVersion();
            });
        }, // onRejected:
        function(_) {
            return undefined;
        }).then(function(protocolVersion) {
            return new result_summary_1.default(query, parameters, metadata, protocolVersion);
        });
    };
    /**
     * @access private
     */ GenericResult.prototype._createQueuedResultObserver = function(onQueueSizeChanged) {
        var _this = this;
        function createResolvablePromise() {
            var resolvablePromise = {};
            resolvablePromise.promise = new Promise(function(resolve, reject) {
                resolvablePromise.resolve = resolve;
                resolvablePromise.reject = reject;
            });
            return resolvablePromise;
        }
        function isError(elementOrError) {
            return elementOrError instanceof Error;
        }
        function dequeue() {
            return __awaiter(this, void 0, void 0, function() {
                var element;
                var _b;
                return __generator(this, function(_c) {
                    switch(_c.label){
                        case 0:
                            if (buffer.length > 0) {
                                element = (_b = buffer.shift()) !== null && _b !== void 0 ? _b : (0, error_1.newError)('Unexpected empty buffer', error_1.PROTOCOL_ERROR);
                                onQueueSizeChanged();
                                if (isError(element)) {
                                    throw element;
                                }
                                return [
                                    2 /*return*/ ,
                                    element
                                ];
                            }
                            promiseHolder.resolvable = createResolvablePromise();
                            return [
                                4 /*yield*/ ,
                                promiseHolder.resolvable.promise
                            ];
                        case 1:
                            return [
                                2 /*return*/ ,
                                _c.sent()
                            ];
                    }
                });
            });
        }
        var buffer = [];
        var promiseHolder = {
            resolvable: null
        };
        var observer = {
            onNext: function(record) {
                if (_this._mapper != null) {
                    observer._push({
                        done: false,
                        value: _this._mapper(record)
                    });
                } else {
                    observer._push({
                        done: false,
                        value: record
                    });
                }
            },
            onCompleted: function(summary) {
                observer._push({
                    done: true,
                    value: summary
                });
            },
            onError: function(error) {
                observer._push(error);
            },
            _push: function(element) {
                if (promiseHolder.resolvable !== null) {
                    var resolvable = promiseHolder.resolvable;
                    promiseHolder.resolvable = null;
                    if (isError(element)) {
                        resolvable.reject(element);
                    } else {
                        resolvable.resolve(element);
                    }
                } else {
                    buffer.push(element);
                    onQueueSizeChanged();
                }
            },
            dequeue: dequeue,
            dequeueUntilDone: function() {
                return __awaiter(_this, void 0, void 0, function() {
                    var element;
                    return __generator(this, function(_b) {
                        switch(_b.label){
                            case 0:
                                if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
                                ;
                                return [
                                    4 /*yield*/ ,
                                    dequeue()
                                ];
                            case 1:
                                element = _b.sent();
                                if (element.done === true) {
                                    return [
                                        2 /*return*/ ,
                                        element
                                    ];
                                }
                                return [
                                    3 /*break*/ ,
                                    0
                                ];
                            case 2:
                                return [
                                    2 /*return*/ 
                                ];
                        }
                    });
                });
            },
            head: function() {
                return __awaiter(_this, void 0, void 0, function() {
                    var element, element, error_3;
                    return __generator(this, function(_b) {
                        switch(_b.label){
                            case 0:
                                if (buffer.length > 0) {
                                    element = buffer[0];
                                    if (isError(element)) {
                                        throw element;
                                    }
                                    return [
                                        2 /*return*/ ,
                                        element
                                    ];
                                }
                                promiseHolder.resolvable = createResolvablePromise();
                                _b.label = 1;
                            case 1:
                                _b.trys.push([
                                    1,
                                    3,
                                    4,
                                    5
                                ]);
                                return [
                                    4 /*yield*/ ,
                                    promiseHolder.resolvable.promise
                                ];
                            case 2:
                                element = _b.sent();
                                buffer.unshift(element);
                                return [
                                    2 /*return*/ ,
                                    element
                                ];
                            case 3:
                                error_3 = _b.sent();
                                // eslint-disable-next-line
                                // @ts-ignore
                                buffer.unshift(error_3);
                                throw error_3;
                            case 4:
                                onQueueSizeChanged();
                                return [
                                    7 /*endfinally*/ 
                                ];
                            case 5:
                                return [
                                    2 /*return*/ 
                                ];
                        }
                    });
                });
            },
            get size () {
                return buffer.length;
            }
        };
        return observer;
    };
    return GenericResult;
}();
_a = Symbol.toStringTag;
/**
 * A stream of {@link Record} representing the result of a query.
 * Can be consumed eagerly as {@link Promise} resolved with array of records and {@link ResultSummary}
 * summary, or rejected with error that contains {@link string} code and {@link string} message.
 * Alternatively can be consumed lazily using {@link Result#subscribe} function.
 * @access public
 */ var Result = function(_super) {
    __extends(Result, _super);
    function Result() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return Result;
}(GenericResult);
/**
 * A stream of mapped Objects representing the result of a query as mapped with a Record Object Mapping function.
 * Can be consumed eagerly as {@link Promise} resolved with array of records and {@link ResultSummary}
 * summary, or rejected with error that contains {@link string} code and {@link string} message.
 * Alternatively can be consumed lazily using {@link MappedResult#subscribe} function.
 * @access public
 */ var MappedResult = function(_super) {
    __extends(MappedResult, _super);
    function MappedResult() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return MappedResult;
}(GenericResult);
exports.default = Result;
}),
"[project]/frontend/node_modules/neo4j-driver-core/lib/result-eager.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/**
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [https://neo4j.com]
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ Object.defineProperty(exports, "__esModule", {
    value: true
});
/**
 * Represents the fully streamed result
 */ var EagerResult = function() {
    /**
     * @constructor
     * @private
     * @param {string[]} keys The records keys
     * @param {Record[]} records The resulted records
     * @param {ResultSummary[]} summary The result Summary
     */ function EagerResult(keys, records, summary) {
        /**
         * Field keys, in the order the fields appear in the records.
         * @type {string[]}
         */ this.keys = keys;
        /**
         * Field records, in the order the records arrived from the server.
         * @type {Record[]}
         */ this.records = records;
        /**
         * Field summary
         * @type {ResultSummary}
         */ this.summary = summary;
    }
    return EagerResult;
}();
exports.default = EagerResult;
}),
"[project]/frontend/node_modules/neo4j-driver-core/lib/connection-provider.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/**
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [https://neo4j.com]
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ /* eslint-disable @typescript-eslint/promise-function-async */ Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Releasable = void 0;
/**
 * Interface define a releasable resource shape
 *
 * @private
 * @interface
 */ var Releasable = function() {
    function Releasable() {}
    /**
     * @returns {Promise<void>}
     */ Releasable.prototype.release = function() {
        throw new Error('Not implemented');
    };
    return Releasable;
}();
exports.Releasable = Releasable;
/**
 * Interface define a common way to acquire a connection
 *
 * @private
 */ var ConnectionProvider = function() {
    function ConnectionProvider() {}
    /**
     * This method acquires a connection against the specified database.
     *
     * Access mode and Bookmarks only applies to routing driver. Access mode only
     * differentiates the target server for the connection, where WRITE selects a
     * WRITER server, whereas READ selects a READ server. Bookmarks, when specified,
     * is only passed to the routing discovery procedure, for the system database to
     * synchronize on creation of databases and is never used in direct drivers.
     *
     * @param {object} param - object parameter
     * @property {string} param.accessMode - the access mode for the to-be-acquired connection
     * @property {string} param.database - the target database for the to-be-acquired connection
     * @property {Bookmarks} param.bookmarks - the bookmarks to send to routing discovery
     * @property {string} param.impersonatedUser - the impersonated user
     * @property {function (databaseName:string)} param.onDatabaseNameResolved - Callback called when the database name get resolved
     * @property {AuthToken} param.auth - auth token used to authorize for connection acquisition
     * @property {string} param.homeDb - the driver's best guess at the current home database for the user
     * @returns {Promise<Connection>}
     */ ConnectionProvider.prototype.acquireConnection = function(param) {
        throw Error('Not implemented');
    };
    /**
     * This method checks whether the backend database supports multi database functionality
     * by checking protocol handshake result.
     *
     * @returns {Promise<boolean>}
     */ ConnectionProvider.prototype.supportsMultiDb = function() {
        throw Error('Not implemented');
    };
    /**
     * This method checks whether the backend database supports transaction config functionality
     * by checking protocol handshake result.
     *
     * @returns {Promise<boolean>}
     */ ConnectionProvider.prototype.supportsTransactionConfig = function() {
        throw Error('Not implemented');
    };
    /**
     * This method checks whether the backend database supports user impersonation functionality
     * by checking protocol handshake result.
     *
     * @returns {Promise<boolean>}
     */ ConnectionProvider.prototype.supportsUserImpersonation = function() {
        throw Error('Not implemented');
    };
    /**
     * This method checks whether the driver session re-auth functionality
     * by checking protocol handshake result
     *
     * @returns {Promise<boolean>}
     */ ConnectionProvider.prototype.supportsSessionAuth = function() {
        throw Error('Not implemented');
    };
    ConnectionProvider.prototype.SSREnabled = function() {
        return false;
    };
    /**
     * This method verifies the connectivity of the database by trying to acquire a connection
     * for each server available in the cluster.
     *
     * @param {object} param - object parameter
     * @property {string} param.database - the target database for the to-be-acquired connection
     * @property {string} param.accessMode - the access mode for the to-be-acquired connection
     *
     * @returns {Promise<ServerInfo>} promise resolved with server info or rejected with error.
     */ ConnectionProvider.prototype.verifyConnectivityAndGetServerInfo = function(param) {
        throw Error('Not implemented');
    };
    /**
     * This method verifies the authorization credentials work by trying to acquire a connection
     * to one of the servers with the given credentials.
     *
     * @param {object} param - object parameter
     * @property {AuthToken} param.auth - the target auth for the to-be-acquired connection
     * @property {string} param.database - the target database for the to-be-acquired connection
     * @property {string} param.accessMode - the access mode for the to-be-acquired connection
     *
     * @returns {Promise<boolean>} promise resolved with true if succeed, false if failed with
     *  authentication issue and rejected with error if non-authentication error happens.
     */ ConnectionProvider.prototype.verifyAuthentication = function(param) {
        throw Error('Not implemented');
    };
    /**
     * Returns the protocol version negotiated via handshake.
     *
     * Note that this function call _always_ causes a round-trip to the server.
     *
     * @returns {Promise<number>} the protocol version negotiated via handshake.
     * @throws {Error} When protocol negotiation fails
     */ ConnectionProvider.prototype.getNegotiatedProtocolVersion = function() {
        throw Error('Not Implemented');
    };
    /**
     * Closes this connection provider along with its internals (connections, pools, etc.)
     *
     * @returns {Promise<void>}
     */ ConnectionProvider.prototype.close = function() {
        throw Error('Not implemented');
    };
    return ConnectionProvider;
}();
exports.default = ConnectionProvider;
}),
"[project]/frontend/node_modules/neo4j-driver-core/lib/connection.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/**
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [https://neo4j.com]
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
*/ /* eslint-disable @typescript-eslint/promise-function-async */ Object.defineProperty(exports, "__esModule", {
    value: true
});
/**
 * Interface which defines a connection for the core driver object.
 *
 *
 * This connection exposes only methods used by the code module.
 * Methods with connection implementation details can be defined and used
 * by the implementation layer.
 *
 * @private
 * @interface
 */ var Connection = function() {
    function Connection() {}
    /**
     *
     * @param config
     * @returns {ResultStreamObserver}
     */ Connection.prototype.beginTransaction = function(config) {
        throw new Error('Not implemented');
    };
    /**
     *
     * @param query
     * @param parameters
     * @param config
     * @returns {ResultStreamObserver}
     */ Connection.prototype.run = function(query, parameters, config) {
        throw new Error('Not implemented');
    };
    /**
     *
     * @param config
     * @returns {ResultStreamObserver}
     */ Connection.prototype.commitTransaction = function(config) {
        throw new Error('Not implemented');
    };
    /**
     *
     * @param config
     * @returns {ResultStreamObserver}
     */ Connection.prototype.rollbackTransaction = function(config) {
        throw new Error('Not implemented');
    };
    /**
     *
     * @returns {Promise<void>}
     */ Connection.prototype.resetAndFlush = function() {
        throw new Error('Not implemented');
    };
    /**
     *
     * @returns {boolean}
     */ Connection.prototype.isOpen = function() {
        throw new Error('Not implemented');
    };
    /**
     *
     * @returns {number}
     */ Connection.prototype.getProtocolVersion = function() {
        throw new Error('Not implemented');
    };
    /**
     *
     * @returns {boolean}
     */ Connection.prototype.hasOngoingObservableRequests = function() {
        throw new Error('Not implemented');
    };
    return Connection;
}();
exports.default = Connection;
}),
"[project]/frontend/node_modules/neo4j-driver-core/lib/transaction.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/**
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [https://neo4j.com]
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ var __awaiter = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__awaiter || function(thisArg, _arguments, P, generator) {
    function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
            resolve(value);
        });
    }
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
                step(generator["throw"](value));
            } catch (e) {
                reject(e);
            }
        }
        function step(result) {
            result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__generator || function(thisArg, body) {
    var _ = {
        label: 0,
        sent: function() {
            if (t[0] & 1) throw t[1];
            return t[1];
        },
        trys: [],
        ops: []
    }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() {
        return this;
    }), g;
    //TURBOPACK unreachable
    ;
    function verb(n) {
        return function(v) {
            return step([
                n,
                v
            ]);
        };
    }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while(g && (g = 0, op[0] && (_ = 0)), _)try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [
                op[0] & 2,
                t.value
            ];
            switch(op[0]){
                case 0:
                case 1:
                    t = op;
                    break;
                case 4:
                    _.label++;
                    return {
                        value: op[1],
                        done: false
                    };
                case 5:
                    _.label++;
                    y = op[1];
                    op = [
                        0
                    ];
                    continue;
                case 7:
                    op = _.ops.pop();
                    _.trys.pop();
                    continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                        _ = 0;
                        continue;
                    }
                    if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                        _.label = op[1];
                        break;
                    }
                    if (op[0] === 6 && _.label < t[1]) {
                        _.label = t[1];
                        t = op;
                        break;
                    }
                    if (t && _.label < t[2]) {
                        _.label = t[2];
                        _.ops.push(op);
                        break;
                    }
                    if (t[2]) _.ops.pop();
                    _.trys.pop();
                    continue;
            }
            op = body.call(thisArg, _);
        } catch (e) {
            op = [
                6,
                e
            ];
            y = 0;
        } finally{
            f = t = 0;
        }
        if (op[0] & 5) throw op[1];
        return {
            value: op[0] ? op[1] : void 0,
            done: true
        };
    }
};
var __importDefault = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : {
        "default": mod
    };
};
Object.defineProperty(exports, "__esModule", {
    value: true
});
/* eslint-disable @typescript-eslint/promise-function-async */ var util_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/internal/util.js [app-route] (ecmascript)");
var connection_holder_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/internal/connection-holder.js [app-route] (ecmascript)");
var bookmarks_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/internal/bookmarks.js [app-route] (ecmascript)");
var tx_config_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/internal/tx-config.js [app-route] (ecmascript)");
var observers_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/internal/observers.js [app-route] (ecmascript)");
var error_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/error.js [app-route] (ecmascript)");
var result_1 = __importDefault(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/result.js [app-route] (ecmascript)"));
/**
 * Represents a transaction in the Neo4j database.
 *
 * @access public
 */ var Transaction = function() {
    /**
     * @constructor
     * @param {object} args
     * @param {ConnectionHolder} args.connectionHolder - the connection holder to get connection from.
     * @param {function()} args.onClose - Function to be called when transaction is committed or rolled back.
     * @param {function(bookmarks: Bookmarks)} args.onBookmarks callback invoked when new bookmark is produced.
     * @param {function()} args.onConnection - Function to be called when a connection is obtained to ensure the conneciton
     * is not yet released.
     * @param {boolean} args.reactive whether this transaction generates reactive streams
     * @param {number} args.fetchSize - the record fetch size in each pulling batch.
     * @param {string} args.impersonatedUser - The name of the user which should be impersonated for the duration of the session.
     * @param {number} args.highRecordWatermark - The high watermark for the record buffer.
     * @param {number} args.lowRecordWatermark - The low watermark for the record buffer.
     * @param {NotificationFilter} args.notificationFilter - The notification filter used for this transaction.
     * @param {NonAutoCommitApiTelemetryConfig} args.apiTelemetryConfig - The api telemetry configuration. Empty/Null for disabling telemetry
     */ function Transaction(_a) {
        var connectionHolder = _a.connectionHolder, onClose = _a.onClose, onBookmarks = _a.onBookmarks, onConnection = _a.onConnection, reactive = _a.reactive, fetchSize = _a.fetchSize, impersonatedUser = _a.impersonatedUser, highRecordWatermark = _a.highRecordWatermark, lowRecordWatermark = _a.lowRecordWatermark, notificationFilter = _a.notificationFilter, apiTelemetryConfig = _a.apiTelemetryConfig;
        var _this = this;
        this._connectionHolder = connectionHolder;
        this._reactive = reactive;
        this._state = _states.ACTIVE;
        this._onClose = onClose;
        this._onBookmarks = onBookmarks;
        this._onConnection = onConnection;
        this._onError = this._onErrorCallback.bind(this);
        this._fetchSize = fetchSize;
        this._onComplete = this._onCompleteCallback.bind(this);
        this._results = [];
        this._impersonatedUser = impersonatedUser;
        this._lowRecordWatermark = lowRecordWatermark;
        this._highRecordWatermark = highRecordWatermark;
        this._bookmarks = bookmarks_1.Bookmarks.empty();
        this._notificationFilter = notificationFilter;
        this._apiTelemetryConfig = apiTelemetryConfig;
        this._acceptActive = function() {}; // satisfy DenoJS
        this._activePromise = new Promise(function(resolve, reject) {
            _this._acceptActive = resolve;
        });
    }
    /**
     * @private
     * @param {Bookmarks | string |  string []} bookmarks
     * @param {TxConfig} txConfig
     * @param {Object} events List of observers to events
     * @returns {void}
     */ Transaction.prototype._begin = function(getBookmarks, txConfig, events) {
        var _this = this;
        this._connectionHolder.getConnection().then(function(connection) {
            return __awaiter(_this, void 0, void 0, function() {
                var _a;
                var _this = this;
                return __generator(this, function(_b) {
                    switch(_b.label){
                        case 0:
                            this._onConnection();
                            if (!(connection != null)) return [
                                3 /*break*/ ,
                                2
                            ];
                            _a = this;
                            return [
                                4 /*yield*/ ,
                                getBookmarks()
                            ];
                        case 1:
                            _a._bookmarks = _b.sent();
                            return [
                                2 /*return*/ ,
                                connection.beginTransaction({
                                    bookmarks: this._bookmarks,
                                    txConfig: txConfig,
                                    mode: this._connectionHolder.mode(),
                                    database: this._connectionHolder.database(),
                                    impersonatedUser: this._impersonatedUser,
                                    notificationFilter: this._notificationFilter,
                                    apiTelemetryConfig: this._apiTelemetryConfig,
                                    beforeError: function(error) {
                                        if (events != null) {
                                            events.onError(error);
                                        }
                                        _this._onError(error).catch(function() {});
                                    },
                                    afterComplete: function(metadata) {
                                        if (events != null) {
                                            events.onComplete(metadata);
                                        }
                                        if (metadata.db !== undefined && (events === null || events === void 0 ? void 0 : events.onDB) != null) {
                                            events.onDB(metadata.db);
                                        }
                                        _this._onComplete(metadata);
                                    }
                                })
                            ];
                        case 2:
                            throw (0, error_1.newError)('No connection available');
                    }
                });
            });
        }).catch(function(error) {
            if (events != null) {
                events.onError(error);
            }
            _this._onError(error).catch(function() {});
        })// It should make the transaction active anyway
        // further errors will be treated by the existing
        // observers
        .finally(function() {
            return _this._acceptActive();
        });
    };
    /**
     * Run Cypher query
     * Could be called with a query object i.e.: `{text: "MATCH ...", parameters: {param: 1}}`
     * or with the query and parameters as separate arguments.
     * @param {mixed} query - Cypher query to execute
     * @param {Object} parameters - Map with parameters to use in query
     * @return {Result} New Result
     */ Transaction.prototype.run = function(query, parameters) {
        var _a = (0, util_1.validateQueryAndParameters)(query, parameters), validatedQuery = _a.validatedQuery, params = _a.params;
        var result = this._state.run(validatedQuery, params, {
            connectionHolder: this._connectionHolder,
            onError: this._onError,
            onComplete: this._onComplete,
            onConnection: this._onConnection,
            reactive: this._reactive,
            fetchSize: this._fetchSize,
            highRecordWatermark: this._highRecordWatermark,
            lowRecordWatermark: this._lowRecordWatermark,
            preparationJob: this._activePromise
        });
        this._results.push(result);
        return result;
    };
    /**
     * Commits the transaction and returns the result.
     *
     * After committing the transaction can no longer be used.
     *
     * @returns {Promise<void>} An empty promise if committed successfully or error if any error happened during commit.
     */ Transaction.prototype.commit = function() {
        var _this = this;
        var committed = this._state.commit({
            connectionHolder: this._connectionHolder,
            onError: this._onError,
            onComplete: function(meta) {
                return _this._onCompleteCallback(meta, _this._bookmarks);
            },
            onConnection: this._onConnection,
            pendingResults: this._results,
            preparationJob: this._activePromise
        });
        this._state = committed.state;
        // clean up
        this._onClose();
        return new Promise(function(resolve, reject) {
            committed.result.subscribe({
                onCompleted: function() {
                    return resolve();
                },
                onError: function(error) {
                    return reject(error);
                }
            });
        });
    };
    /**
     * Rollbacks the transaction.
     *
     * After rolling back, the transaction can no longer be used.
     *
     * @returns {Promise<void>} An empty promise if rolled back successfully or error if any error happened during
     * rollback.
     */ Transaction.prototype.rollback = function() {
        var rolledback = this._state.rollback({
            connectionHolder: this._connectionHolder,
            onError: this._onError,
            onComplete: this._onComplete,
            onConnection: this._onConnection,
            pendingResults: this._results,
            preparationJob: this._activePromise
        });
        this._state = rolledback.state;
        // clean up
        this._onClose();
        return new Promise(function(resolve, reject) {
            rolledback.result.subscribe({
                onCompleted: function() {
                    return resolve();
                },
                onError: function(error) {
                    return reject(error);
                }
            });
        });
    };
    /**
     * Check if this transaction is active, which means commit and rollback did not happen.
     * @return {boolean} `true` when not committed and not rolled back, `false` otherwise.
     */ Transaction.prototype.isOpen = function() {
        return this._state === _states.ACTIVE;
    };
    /**
     * Closes the transaction
     *
     * This method will roll back the transaction if it is not already committed or rolled back.
     *
     * @returns {Promise<void>} An empty promise if closed successfully or error if any error happened during
     */ Transaction.prototype.close = function() {
        return __awaiter(this, void 0, void 0, function() {
            return __generator(this, function(_a) {
                switch(_a.label){
                    case 0:
                        if (!this.isOpen()) return [
                            3 /*break*/ ,
                            2
                        ];
                        return [
                            4 /*yield*/ ,
                            this.rollback()
                        ];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        return [
                            2 /*return*/ 
                        ];
                }
            });
        });
    };
    // eslint-disable-next-line
    // @ts-ignore
    Transaction.prototype[Symbol.asyncDispose] = function() {
        return this.close();
    };
    Transaction.prototype._onErrorCallback = function(error) {
        // error will be "acknowledged" by sending a RESET message
        // database will then forget about this transaction and cleanup all corresponding resources
        // it is thus safe to move this transaction to a FAILED state and disallow any further interactions with it
        if (this._state === _states.FAILED) {
            // already failed, nothing to do
            // if we call onError for each result again, we might run into an infinite loop, that causes an OOM eventually
            return Promise.resolve(null);
        }
        this._state = _states.FAILED;
        this._onClose();
        this._results.forEach(function(result) {
            if (result.isOpen()) {
                // @ts-expect-error
                result._streamObserverPromise.then(function(resultStreamObserver) {
                    return resultStreamObserver.onError(error);
                })// Nothing to do since we don't have a observer to notify the error
                // the result will be already broke in other ways.
                .catch(function(_) {});
            }
        });
        // release connection back to the pool
        return this._connectionHolder.releaseConnection();
    };
    /**
     * @private
     * @param {object} meta The meta with bookmarks
     * @returns {void}
     */ Transaction.prototype._onCompleteCallback = function(meta, previousBookmarks) {
        this._onBookmarks(new bookmarks_1.Bookmarks(meta === null || meta === void 0 ? void 0 : meta.bookmark), previousBookmarks !== null && previousBookmarks !== void 0 ? previousBookmarks : bookmarks_1.Bookmarks.empty(), meta === null || meta === void 0 ? void 0 : meta.db);
    };
    return Transaction;
}();
var _states = {
    // The transaction is running with no explicit success or failure marked
    ACTIVE: {
        commit: function(_a) {
            var connectionHolder = _a.connectionHolder, onError = _a.onError, onComplete = _a.onComplete, onConnection = _a.onConnection, pendingResults = _a.pendingResults, preparationJob = _a.preparationJob;
            return {
                result: finishTransaction(true, connectionHolder, onError, onComplete, onConnection, pendingResults, preparationJob),
                state: _states.SUCCEEDED
            };
        },
        rollback: function(_a) {
            var connectionHolder = _a.connectionHolder, onError = _a.onError, onComplete = _a.onComplete, onConnection = _a.onConnection, pendingResults = _a.pendingResults, preparationJob = _a.preparationJob;
            return {
                result: finishTransaction(false, connectionHolder, onError, onComplete, onConnection, pendingResults, preparationJob),
                state: _states.ROLLED_BACK
            };
        },
        run: function(query, parameters, _a) {
            var connectionHolder = _a.connectionHolder, onError = _a.onError, onComplete = _a.onComplete, onConnection = _a.onConnection, reactive = _a.reactive, fetchSize = _a.fetchSize, highRecordWatermark = _a.highRecordWatermark, lowRecordWatermark = _a.lowRecordWatermark, preparationJob = _a.preparationJob;
            // RUN in explicit transaction can't contain bookmarks and transaction configuration
            // No need to include mode and database name as it shall be included in begin
            var requirements = preparationJob !== null && preparationJob !== void 0 ? preparationJob : Promise.resolve();
            var observerPromise = connectionHolder.getConnection().then(function(conn) {
                return requirements.then(function() {
                    return conn;
                });
            }).then(function(conn) {
                onConnection();
                if (conn != null) {
                    return conn.run(query, parameters, {
                        bookmarks: bookmarks_1.Bookmarks.empty(),
                        txConfig: tx_config_1.TxConfig.empty(),
                        beforeError: onError,
                        afterComplete: onComplete,
                        reactive: reactive,
                        fetchSize: fetchSize,
                        highRecordWatermark: highRecordWatermark,
                        lowRecordWatermark: lowRecordWatermark
                    });
                } else {
                    throw (0, error_1.newError)('No connection available');
                }
            }).catch(function(error) {
                return new observers_1.FailedObserver({
                    error: error,
                    onError: onError
                });
            });
            return newCompletedResult(observerPromise, query, parameters, connectionHolder, highRecordWatermark, lowRecordWatermark);
        }
    },
    // An error has occurred, transaction can no longer be used and no more messages will
    // be sent for this transaction.
    FAILED: {
        commit: function(_a) {
            var connectionHolder = _a.connectionHolder, onError = _a.onError, onComplete = _a.onComplete;
            return {
                result: newCompletedResult(new observers_1.FailedObserver({
                    error: (0, error_1.newError)('Cannot commit this transaction, because it has been rolled back either because of an error or explicit termination.'),
                    onError: onError
                }), 'COMMIT', {}, connectionHolder, 0, 0 // low watermark
                ),
                state: _states.FAILED
            };
        },
        rollback: function(_a) {
            var connectionHolder = _a.connectionHolder, onError = _a.onError, onComplete = _a.onComplete;
            return {
                result: newCompletedResult(new observers_1.CompletedObserver(), 'ROLLBACK', {}, connectionHolder, 0, 0 // low watermark
                ),
                state: _states.FAILED
            };
        },
        run: function(query, parameters, _a) {
            var connectionHolder = _a.connectionHolder, onError = _a.onError, onComplete = _a.onComplete;
            return newCompletedResult(new observers_1.FailedObserver({
                error: (0, error_1.newError)('Cannot run query in this transaction, because it has been rolled back either because of an error or explicit termination.'),
                onError: onError
            }), query, parameters, connectionHolder, 0, 0 // low watermark
            );
        }
    },
    // This transaction has successfully committed
    SUCCEEDED: {
        commit: function(_a) {
            var connectionHolder = _a.connectionHolder, onError = _a.onError, onComplete = _a.onComplete;
            return {
                result: newCompletedResult(new observers_1.FailedObserver({
                    error: (0, error_1.newError)('Cannot commit this transaction, because it has already been committed.'),
                    onError: onError
                }), 'COMMIT', {}, connection_holder_1.EMPTY_CONNECTION_HOLDER, 0, 0 // low watermark
                ),
                state: _states.SUCCEEDED,
                connectionHolder: connectionHolder
            };
        },
        rollback: function(_a) {
            var connectionHolder = _a.connectionHolder, onError = _a.onError, onComplete = _a.onComplete;
            return {
                result: newCompletedResult(new observers_1.FailedObserver({
                    error: (0, error_1.newError)('Cannot rollback this transaction, because it has already been committed.'),
                    onError: onError
                }), 'ROLLBACK', {}, connection_holder_1.EMPTY_CONNECTION_HOLDER, 0, 0 // low watermark
                ),
                state: _states.SUCCEEDED,
                connectionHolder: connectionHolder
            };
        },
        run: function(query, parameters, _a) {
            var connectionHolder = _a.connectionHolder, onError = _a.onError, onComplete = _a.onComplete;
            return newCompletedResult(new observers_1.FailedObserver({
                error: (0, error_1.newError)('Cannot run query in this transaction, because it has already been committed.'),
                onError: onError
            }), query, parameters, connectionHolder, 0, 0 // low watermark
            );
        }
    },
    // This transaction has been rolled back
    ROLLED_BACK: {
        commit: function(_a) {
            var connectionHolder = _a.connectionHolder, onError = _a.onError, onComplete = _a.onComplete;
            return {
                result: newCompletedResult(new observers_1.FailedObserver({
                    error: (0, error_1.newError)('Cannot commit this transaction, because it has already been rolled back.'),
                    onError: onError
                }), 'COMMIT', {}, connectionHolder, 0, 0 // low watermark
                ),
                state: _states.ROLLED_BACK
            };
        },
        rollback: function(_a) {
            var connectionHolder = _a.connectionHolder, onError = _a.onError, onComplete = _a.onComplete;
            return {
                result: newCompletedResult(new observers_1.FailedObserver({
                    error: (0, error_1.newError)('Cannot rollback this transaction, because it has already been rolled back.')
                }), 'ROLLBACK', {}, connectionHolder, 0, 0 // low watermark
                ),
                state: _states.ROLLED_BACK
            };
        },
        run: function(query, parameters, _a) {
            var connectionHolder = _a.connectionHolder, onError = _a.onError, onComplete = _a.onComplete;
            return newCompletedResult(new observers_1.FailedObserver({
                error: (0, error_1.newError)('Cannot run query in this transaction, because it has already been rolled back.'),
                onError: onError
            }), query, parameters, connectionHolder, 0, 0 // low watermark
            );
        }
    }
};
/**
 *
 * @param {boolean} commit
 * @param {ConnectionHolder} connectionHolder
 * @param {function(err:Error): any} onError
 * @param {function(metadata:object): any} onComplete
 * @param {function() : any} onConnection
 * @param {list<Result>>}pendingResults all run results in this transaction
 */ function finishTransaction(commit, connectionHolder, onError, onComplete, onConnection, pendingResults, preparationJob) {
    var requirements = preparationJob !== null && preparationJob !== void 0 ? preparationJob : Promise.resolve();
    var observerPromise = connectionHolder.getConnection().then(function(conn) {
        return requirements.then(function() {
            return conn;
        });
    }).then(function(connection) {
        onConnection();
        pendingResults.forEach(function(r) {
            return r._cancel();
        });
        return Promise.all(pendingResults.map(function(result) {
            return result.summary();
        })).then(function(results) {
            if (connection != null) {
                if (commit) {
                    return connection.commitTransaction({
                        beforeError: onError,
                        afterComplete: onComplete
                    });
                } else {
                    return connection.rollbackTransaction({
                        beforeError: onError,
                        afterComplete: onComplete
                    });
                }
            } else {
                throw (0, error_1.newError)('No connection available');
            }
        });
    }).catch(function(error) {
        return new observers_1.FailedObserver({
            error: error,
            onError: onError
        });
    });
    // for commit & rollback we need result that uses real connection holder and notifies it when
    // connection is not needed and can be safely released to the pool
    return new result_1.default(observerPromise, commit ? 'COMMIT' : 'ROLLBACK', {}, connectionHolder, {
        high: Number.MAX_VALUE,
        low: Number.MAX_VALUE
    });
}
/**
 * Creates a {@link Result} with empty connection holder.
 * For cases when result represents an intermediate or failed action, does not require any metadata and does not
 * need to influence real connection holder to release connections.
 * @param {ResultStreamObserver} observer - an observer for the created result.
 * @param {string} query - the cypher query that produced the result.
 * @param {Object} parameters - the parameters for cypher query that produced the result.
 * @param {ConnectionHolder} connectionHolder - the connection holder used to get the result
 * @return {Result} new result.
 * @private
 */ function newCompletedResult(observerPromise, query, parameters, connectionHolder, highRecordWatermark, lowRecordWatermark) {
    if (connectionHolder === void 0) {
        connectionHolder = connection_holder_1.EMPTY_CONNECTION_HOLDER;
    }
    return new result_1.default(Promise.resolve(observerPromise), query, parameters, new connection_holder_1.ReadOnlyConnectionHolder(connectionHolder !== null && connectionHolder !== void 0 ? connectionHolder : connection_holder_1.EMPTY_CONNECTION_HOLDER), {
        low: lowRecordWatermark,
        high: highRecordWatermark
    });
}
exports.default = Transaction;
}),
"[project]/frontend/node_modules/neo4j-driver-core/lib/transaction-managed.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/**
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [https://neo4j.com]
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ Object.defineProperty(exports, "__esModule", {
    value: true
});
/**
 * Represents a transaction that is managed by the transaction executor.
 *
 * @public
 */ var ManagedTransaction = function() {
    /**
     * @private
     */ function ManagedTransaction(_a) {
        var run = _a.run;
        /**
         * @private
         */ this._run = run;
    }
    /**
     * @private
     * @param {Transaction} tx - Transaction to wrap
     * @returns {ManagedTransaction} the ManagedTransaction
     */ ManagedTransaction.fromTransaction = function(tx) {
        return new ManagedTransaction({
            run: tx.run.bind(tx)
        });
    };
    /**
     * Run Cypher query
     * Could be called with a query object i.e.: `{text: "MATCH ...", parameters: {param: 1}}`
     * or with the query and parameters as separate arguments.
     * @param {mixed} query - Cypher query to execute
     * @param {Object} parameters - Map with parameters to use in query
     * @return {Result} New Result
     */ ManagedTransaction.prototype.run = function(query, parameters) {
        return this._run(query, parameters);
    };
    return ManagedTransaction;
}();
exports.default = ManagedTransaction;
}),
"[project]/frontend/node_modules/neo4j-driver-core/lib/transaction-promise.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/**
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [https://neo4j.com]
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ var __extends = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__extends || function() {
    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || ({
            __proto__: []
        }) instanceof Array && function(d, b) {
            d.__proto__ = b;
        } || function(d, b) {
            for(var p in b)if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
        };
        return extendStatics(d, b);
    };
    return function(d, b) {
        if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
}();
var __assign = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__assign || function() {
    __assign = Object.assign || function(t) {
        for(var s, i = 1, n = arguments.length; i < n; i++){
            s = arguments[i];
            for(var p in s)if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : {
        "default": mod
    };
};
var _a;
Object.defineProperty(exports, "__esModule", {
    value: true
});
/* eslint-disable @typescript-eslint/promise-function-async */ var transaction_1 = __importDefault(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/transaction.js [app-route] (ecmascript)"));
/**
 * Represents a Promise<{@link Transaction}> object and a {@link Transaction} object.
 *
 * Resolving this object promise verifies the result of the transaction begin and returns the {@link Transaction} object in case of success.
 *
 * The object can still also used as {@link Transaction} for convenience. The result of begin will be checked
 * during the next API calls in the object as it is in the transaction.
 *
 * @access public
 */ var TransactionPromise = function(_super) {
    __extends(TransactionPromise, _super);
    /**
     * @constructor
     * @param {object} args
     * @param {ConnectionHolder} args.connectionHolder - the connection holder to get connection from.
     * @param {function()} args.onClose - Function to be called when transaction is committed or rolled back.
     * @param {function(bookmarks: Bookmarks)} args.onBookmarks callback invoked when new bookmark is produced.
     * @param {function()} args.onConnection - Function to be called when a connection is obtained to ensure the connection
     * is not yet released.
     * @param {boolean} args.reactive whether this transaction generates reactive streams
     * @param {number} args.fetchSize - the record fetch size in each pulling batch.
     * @param {string} args.impersonatedUser - The name of the user which should be impersonated for the duration of the session.
     * @param {NotificationFilter} args.notificationFilter - The notification filter used for this transaction.
     * @param {NonAutoCommitApiTelemetryConfig} args.apiTelemetryConfig - The api telemetry configuration. Empty/Null for disabling telemetry
     */ function TransactionPromise(_b) {
        var connectionHolder = _b.connectionHolder, onClose = _b.onClose, onBookmarks = _b.onBookmarks, onConnection = _b.onConnection, reactive = _b.reactive, fetchSize = _b.fetchSize, impersonatedUser = _b.impersonatedUser, highRecordWatermark = _b.highRecordWatermark, lowRecordWatermark = _b.lowRecordWatermark, notificationFilter = _b.notificationFilter, apiTelemetryConfig = _b.apiTelemetryConfig, onDbCallback = _b.onDbCallback;
        var _this = _super.call(this, {
            connectionHolder: connectionHolder,
            onClose: onClose,
            onBookmarks: onBookmarks,
            onConnection: onConnection,
            reactive: reactive,
            fetchSize: fetchSize,
            impersonatedUser: impersonatedUser,
            highRecordWatermark: highRecordWatermark,
            lowRecordWatermark: lowRecordWatermark,
            notificationFilter: notificationFilter,
            apiTelemetryConfig: apiTelemetryConfig
        }) || this;
        _this[_a] = 'TransactionPromise';
        _this._onDbCallback = onDbCallback;
        return _this;
    }
    /**
     * Waits for the begin to complete.
     *
     * @param {function(transaction: Transaction)} onFulfilled - function to be called when finished.
     * @param {function(error: {message:string, code:string})} onRejected - function to be called upon errors.
     * @return {Promise} promise.
     */ TransactionPromise.prototype.then = function(onfulfilled, onrejected) {
        return this._getOrCreateBeginPromise().then(onfulfilled, onrejected);
    };
    /**
     * Catch errors when using promises.
     *
     * @param {function(error: Neo4jError)} onRejected - Function to be called upon errors.
     * @return {Promise} promise.
     */ TransactionPromise.prototype.catch = function(onrejected) {
        return this._getOrCreateBeginPromise().catch(onrejected);
    };
    /**
     * Called when finally the begin is done
     *
     * @param {function()|null} onfinally - function when the promise finished
     * @return {Promise} promise.
     */ TransactionPromise.prototype.finally = function(onfinally) {
        return this._getOrCreateBeginPromise().finally(onfinally);
    };
    TransactionPromise.prototype._getOrCreateBeginPromise = function() {
        var _this = this;
        if (this._beginPromise == null) {
            this._beginPromise = new Promise(function(resolve, reject) {
                _this._resolve = resolve;
                _this._reject = reject;
                if (_this._beginError != null) {
                    reject(_this._beginError);
                }
                if (_this._beginMetadata != null) {
                    resolve(_this._toTransaction());
                }
            });
        }
        return this._beginPromise;
    };
    /**
     * @access private
     */ TransactionPromise.prototype._toTransaction = function() {
        return __assign(__assign({}, this), {
            run: _super.prototype.run.bind(this),
            commit: _super.prototype.commit.bind(this),
            rollback: _super.prototype.rollback.bind(this),
            close: _super.prototype.close.bind(this),
            isOpen: _super.prototype.isOpen.bind(this),
            _begin: this._begin.bind(this)
        });
    };
    /**
     * @access private
     */ TransactionPromise.prototype._begin = function(bookmarks, txConfig) {
        return _super.prototype._begin.call(this, bookmarks, txConfig, {
            onError: this._onBeginError.bind(this),
            onComplete: this._onBeginMetadata.bind(this),
            onDB: this._onDbCallback
        });
    };
    /**
     * @access private
     * @returns {void}
     */ TransactionPromise.prototype._onBeginError = function(error) {
        this._beginError = error;
        if (this._reject != null) {
            this._reject(error);
        }
    };
    /**
     * @access private
     * @returns {void}
     */ TransactionPromise.prototype._onBeginMetadata = function(metadata) {
        this._beginMetadata = metadata !== null && metadata !== void 0 ? metadata : {};
        if (this._resolve != null) {
            this._resolve(this._toTransaction());
        }
    };
    return TransactionPromise;
}(transaction_1.default);
_a = Symbol.toStringTag;
exports.default = TransactionPromise;
}),
"[project]/frontend/node_modules/neo4j-driver-core/lib/internal/auth-util.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/**
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [https://neo4j.com]
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.cacheKey = cacheKey;
var json_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/json.js [app-route] (ecmascript)");
function cacheKey(auth, impersonatedUser) {
    var _a;
    if (impersonatedUser != null) {
        return 'basic:' + impersonatedUser;
    }
    if (auth === undefined) {
        return 'DEFAULT';
    }
    if (auth.scheme === 'basic') {
        return 'basic:' + ((_a = auth.principal) !== null && _a !== void 0 ? _a : '');
    }
    if (auth.scheme === 'kerberos') {
        return 'kerberos:' + auth.credentials;
    }
    if (auth.scheme === 'bearer') {
        return 'bearer:' + auth.credentials;
    }
    if (auth.scheme === 'none') {
        return 'none';
    }
    return (0, json_1.stringify)(auth, {
        sortedElements: true
    });
}
}),
"[project]/frontend/node_modules/neo4j-driver-core/lib/session.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/**
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [https://neo4j.com]
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ var __awaiter = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__awaiter || function(thisArg, _arguments, P, generator) {
    function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
            resolve(value);
        });
    }
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
                step(generator["throw"](value));
            } catch (e) {
                reject(e);
            }
        }
        function step(result) {
            result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__generator || function(thisArg, body) {
    var _ = {
        label: 0,
        sent: function() {
            if (t[0] & 1) throw t[1];
            return t[1];
        },
        trys: [],
        ops: []
    }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() {
        return this;
    }), g;
    //TURBOPACK unreachable
    ;
    function verb(n) {
        return function(v) {
            return step([
                n,
                v
            ]);
        };
    }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while(g && (g = 0, op[0] && (_ = 0)), _)try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [
                op[0] & 2,
                t.value
            ];
            switch(op[0]){
                case 0:
                case 1:
                    t = op;
                    break;
                case 4:
                    _.label++;
                    return {
                        value: op[1],
                        done: false
                    };
                case 5:
                    _.label++;
                    y = op[1];
                    op = [
                        0
                    ];
                    continue;
                case 7:
                    op = _.ops.pop();
                    _.trys.pop();
                    continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                        _ = 0;
                        continue;
                    }
                    if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                        _.label = op[1];
                        break;
                    }
                    if (op[0] === 6 && _.label < t[1]) {
                        _.label = t[1];
                        t = op;
                        break;
                    }
                    if (t && _.label < t[2]) {
                        _.label = t[2];
                        _.ops.push(op);
                        break;
                    }
                    if (t[2]) _.ops.pop();
                    _.trys.pop();
                    continue;
            }
            op = body.call(thisArg, _);
        } catch (e) {
            op = [
                6,
                e
            ];
            y = 0;
        } finally{
            f = t = 0;
        }
        if (op[0] & 5) throw op[1];
        return {
            value: op[0] ? op[1] : void 0,
            done: true
        };
    }
};
var __read = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__read || function(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while((n === void 0 || n-- > 0) && !(r = i.next()).done)ar.push(r.value);
    } catch (error) {
        e = {
            error: error
        };
    } finally{
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        } finally{
            if (e) throw e.error;
        }
    }
    return ar;
};
var __spreadArray = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__spreadArray || function(to, from, pack) {
    if (pack || arguments.length === 2) for(var i = 0, l = from.length, ar; i < l; i++){
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : {
        "default": mod
    };
};
Object.defineProperty(exports, "__esModule", {
    value: true
});
/* eslint-disable @typescript-eslint/promise-function-async */ var observers_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/internal/observers.js [app-route] (ecmascript)");
var util_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/internal/util.js [app-route] (ecmascript)");
var constants_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/internal/constants.js [app-route] (ecmascript)");
var error_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/error.js [app-route] (ecmascript)");
var result_1 = __importDefault(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/result.js [app-route] (ecmascript)"));
var connection_holder_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/internal/connection-holder.js [app-route] (ecmascript)");
var transaction_executor_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/internal/transaction-executor.js [app-route] (ecmascript)");
var bookmarks_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/internal/bookmarks.js [app-route] (ecmascript)");
var tx_config_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/internal/tx-config.js [app-route] (ecmascript)");
var transaction_promise_1 = __importDefault(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/transaction-promise.js [app-route] (ecmascript)"));
var transaction_managed_1 = __importDefault(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/transaction-managed.js [app-route] (ecmascript)"));
var auth_util_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/internal/auth-util.js [app-route] (ecmascript)");
/**
 * A Session instance is used for handling the connection and
 * sending queries through the connection.
 * In a single session, multiple queries will be executed serially.
 * In order to execute parallel queries, multiple sessions are required.
 * @access public
 */ var Session = function() {
    /**
     * @constructor
     * @protected
     * @param {Object} args
     * @param {string} args.mode the default access mode for this session.
     * @param {ConnectionProvider} args.connectionProvider - The connection provider to acquire connections from.
     * @param {Bookmarks} args.bookmarks - The initial bookmarks for this session.
     * @param {string} args.database the database name
     * @param {Object} args.config={} - This driver configuration.
     * @param {boolean} args.reactive - Whether this session should create reactive streams
     * @param {number} args.fetchSize - Defines how many records is pulled in each pulling batch
     * @param {string} args.impersonatedUser - The username which the user wants to impersonate for the duration of the session.
     * @param {BookmarkManager} args.bookmarkManager - The bookmark manager used for this session.
     * @param {NotificationFilter} args.notificationFilter - The notification filter used for this session.
     * @param {AuthToken} args.auth - the target auth for the to-be-acquired connection
     * @param {Logger} args.log - the logger used for logs in this session.
     * @param {(user:string, database:string) => void} args.homeDatabaseCallback - callback used to update the home database cache
     */ function Session(_a) {
        var mode = _a.mode, connectionProvider = _a.connectionProvider, bookmarks = _a.bookmarks, database = _a.database, config = _a.config, reactive = _a.reactive, fetchSize = _a.fetchSize, impersonatedUser = _a.impersonatedUser, bookmarkManager = _a.bookmarkManager, notificationFilter = _a.notificationFilter, auth = _a.auth, log = _a.log, homeDatabaseCallback = _a.homeDatabaseCallback;
        var _b;
        this._mode = mode;
        this._database = database;
        this._reactive = reactive;
        this._fetchSize = fetchSize;
        this._homeDatabaseCallback = homeDatabaseCallback;
        this._auth = auth;
        this._getConnectionAcquistionBookmarks = this._getConnectionAcquistionBookmarks.bind(this);
        this._readConnectionHolder = new connection_holder_1.ConnectionHolder({
            mode: constants_1.ACCESS_MODE_READ,
            auth: auth,
            database: database,
            bookmarks: bookmarks,
            connectionProvider: connectionProvider,
            impersonatedUser: impersonatedUser,
            onDatabaseNameResolved: this._onDatabaseNameResolved.bind(this),
            getConnectionAcquistionBookmarks: this._getConnectionAcquistionBookmarks,
            log: log
        });
        this._writeConnectionHolder = new connection_holder_1.ConnectionHolder({
            mode: constants_1.ACCESS_MODE_WRITE,
            auth: auth,
            database: database,
            bookmarks: bookmarks,
            connectionProvider: connectionProvider,
            impersonatedUser: impersonatedUser,
            onDatabaseNameResolved: this._onDatabaseNameResolved.bind(this),
            getConnectionAcquistionBookmarks: this._getConnectionAcquistionBookmarks,
            log: log
        });
        this._open = true;
        this._hasTx = false;
        this._impersonatedUser = impersonatedUser;
        this._lastBookmarks = bookmarks !== null && bookmarks !== void 0 ? bookmarks : bookmarks_1.Bookmarks.empty();
        this._configuredBookmarks = this._lastBookmarks;
        this._transactionExecutor = _createTransactionExecutor(config);
        this._databaseNameResolved = this._database !== '';
        var calculatedWatermaks = this._calculateWatermaks();
        this._lowRecordWatermark = calculatedWatermaks.low;
        this._highRecordWatermark = calculatedWatermaks.high;
        this._results = [];
        this._bookmarkManager = bookmarkManager;
        this._notificationFilter = notificationFilter;
        this._log = log;
        this._databaseGuess = config === null || config === void 0 ? void 0 : config.cachedHomeDatabase;
        this._isRoutingSession = (_b = config === null || config === void 0 ? void 0 : config.routingDriver) !== null && _b !== void 0 ? _b : false;
    }
    /**
     * Run Cypher query
     * Could be called with a query object i.e.: `{text: "MATCH ...", parameters: {param: 1}}`
     * or with the query and parameters as separate arguments.
     *
     * @public
     * @param {mixed} query - Cypher query to execute
     * @param {Object} parameters - Map with parameters to use in query
     * @param {TransactionConfig} [transactionConfig] - Configuration for the new auto-commit transaction.
     * @return {Result} New Result.
     */ Session.prototype.run = function(query, parameters, transactionConfig) {
        var _this = this;
        var _a = (0, util_1.validateQueryAndParameters)(query, parameters), validatedQuery = _a.validatedQuery, params = _a.params;
        var autoCommitTxConfig = transactionConfig != null ? new tx_config_1.TxConfig(transactionConfig, this._log) : tx_config_1.TxConfig.empty();
        var result = this._run(validatedQuery, params, function(connection) {
            return __awaiter(_this, void 0, void 0, function() {
                var bookmarks;
                var _this = this;
                return __generator(this, function(_a) {
                    switch(_a.label){
                        case 0:
                            return [
                                4 /*yield*/ ,
                                this._bookmarks()
                            ];
                        case 1:
                            bookmarks = _a.sent();
                            this._assertSessionIsOpen();
                            return [
                                2 /*return*/ ,
                                connection.run(validatedQuery, params, {
                                    bookmarks: bookmarks,
                                    txConfig: autoCommitTxConfig,
                                    mode: this._mode,
                                    database: this._database,
                                    apiTelemetryConfig: {
                                        api: constants_1.TELEMETRY_APIS.AUTO_COMMIT_TRANSACTION
                                    },
                                    impersonatedUser: this._impersonatedUser,
                                    afterComplete: function(meta) {
                                        return _this._onCompleteCallback(meta, bookmarks);
                                    },
                                    reactive: this._reactive,
                                    fetchSize: this._fetchSize,
                                    lowRecordWatermark: this._lowRecordWatermark,
                                    highRecordWatermark: this._highRecordWatermark,
                                    notificationFilter: this._notificationFilter,
                                    onDb: this._onDatabaseNameResolved.bind(this)
                                })
                            ];
                    }
                });
            });
        });
        this._results.push(result);
        return result;
    };
    Session.prototype._run = function(query, parameters, customRunner) {
        var _a = this._acquireAndConsumeConnection(customRunner), connectionHolder = _a.connectionHolder, resultPromise = _a.resultPromise;
        var observerPromise = resultPromise.catch(function(error) {
            return Promise.resolve(new observers_1.FailedObserver({
                error: error
            }));
        });
        var watermarks = {
            high: this._highRecordWatermark,
            low: this._lowRecordWatermark
        };
        return new result_1.default(observerPromise, query, parameters, connectionHolder, watermarks);
    };
    /**
     * This method is used by Rediscovery on the neo4j-driver-bolt-protocol package.
     *
     * @private
     * @param {function()} connectionConsumer The method which will use the connection
     * @returns {Promise<T>} A connection promise
     */ Session.prototype._acquireConnection = function(connectionConsumer) {
        var _this = this;
        var _a = this._acquireAndConsumeConnection(connectionConsumer), connectionHolder = _a.connectionHolder, resultPromise = _a.resultPromise;
        return resultPromise.then(function(result) {
            return __awaiter(_this, void 0, void 0, function() {
                return __generator(this, function(_a) {
                    switch(_a.label){
                        case 0:
                            return [
                                4 /*yield*/ ,
                                connectionHolder.releaseConnection()
                            ];
                        case 1:
                            _a.sent();
                            return [
                                2 /*return*/ ,
                                result
                            ];
                    }
                });
            });
        });
    };
    /**
     * Acquires a {@link Connection}, consume it and return a promise of the result along with
     * the {@link ConnectionHolder} used in the process.
     *
     * @private
     * @param connectionConsumer
     * @returns {object} The connection holder and connection promise.
     */ Session.prototype._acquireAndConsumeConnection = function(connectionConsumer) {
        var resultPromise;
        var connectionHolder = this._connectionHolderWithMode(this._mode);
        if (!this._open) {
            resultPromise = Promise.reject((0, error_1.newError)('Cannot run query in a closed session.'));
        } else if (!this._hasTx && connectionHolder.initializeConnection(this._databaseGuess)) {
            resultPromise = connectionHolder.getConnection()// Connection won't be null at this point since the initialize method
            // return
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            .then(function(connection) {
                return connectionConsumer(connection);
            });
        } else {
            resultPromise = Promise.reject((0, error_1.newError)('Queries cannot be run directly on a ' + 'session with an open transaction; either run from within the ' + 'transaction or use a different session.'));
        }
        return {
            connectionHolder: connectionHolder,
            resultPromise: resultPromise
        };
    };
    /**
     * Begin a new transaction in this session. A session can have at most one transaction running at a time, if you
     * want to run multiple concurrent transactions, you should use multiple concurrent sessions.
     *
     * While a transaction is open the session cannot be used to run queries outside the transaction.
     *
     * @param {TransactionConfig} [transactionConfig] - Configuration for the new auto-commit transaction.
     * @returns {TransactionPromise} New Transaction.
     */ Session.prototype.beginTransaction = function(transactionConfig) {
        // this function needs to support bookmarks parameter for backwards compatibility
        // parameter was of type {string|string[]} and represented either a single or multiple bookmarks
        // that's why we need to check parameter type and decide how to interpret the value
        var arg = transactionConfig;
        var txConfig = tx_config_1.TxConfig.empty();
        if (arg != null) {
            txConfig = new tx_config_1.TxConfig(arg, this._log);
        }
        return this._beginTransaction(this._mode, txConfig, {
            api: constants_1.TELEMETRY_APIS.UNMANAGED_TRANSACTION
        });
    };
    Session.prototype._beginTransaction = function(accessMode, txConfig, apiTelemetryConfig) {
        var _this = this;
        if (!this._open) {
            throw (0, error_1.newError)('Cannot begin a transaction on a closed session.');
        }
        if (this._hasTx) {
            throw (0, error_1.newError)('You cannot begin a transaction on a session with an open transaction; ' + 'either run from within the transaction or use a different session.');
        }
        var mode = Session._validateSessionMode(accessMode);
        var connectionHolder = this._connectionHolderWithMode(mode);
        connectionHolder.initializeConnection(this._databaseGuess);
        this._hasTx = true;
        var tx = new transaction_promise_1.default({
            connectionHolder: connectionHolder,
            impersonatedUser: this._impersonatedUser,
            onClose: this._transactionClosed.bind(this),
            onBookmarks: function(newBm, oldBm, db) {
                return _this._updateBookmarks(newBm, oldBm, db);
            },
            onConnection: this._assertSessionIsOpen.bind(this),
            reactive: this._reactive,
            fetchSize: this._fetchSize,
            lowRecordWatermark: this._lowRecordWatermark,
            highRecordWatermark: this._highRecordWatermark,
            notificationFilter: this._notificationFilter,
            apiTelemetryConfig: apiTelemetryConfig,
            onDbCallback: this._onDatabaseNameResolved.bind(this)
        });
        tx._begin(function() {
            return _this._bookmarks();
        }, txConfig);
        return tx;
    };
    /**
     * @private
     * @returns {void}
     */ Session.prototype._assertSessionIsOpen = function() {
        if (!this._open) {
            throw (0, error_1.newError)('You cannot run more transactions on a closed session.');
        }
    };
    /**
     * @private
     * @returns {void}
     */ Session.prototype._transactionClosed = function() {
        this._hasTx = false;
    };
    /**
     * Return the bookmarks received following the last completed {@link Transaction}.
     *
     * @return {string[]} A reference to a previous transaction.
     */ Session.prototype.lastBookmarks = function() {
        return this._lastBookmarks.values();
    };
    Session.prototype._bookmarks = function() {
        return __awaiter(this, void 0, void 0, function() {
            var bookmarks;
            var _a;
            return __generator(this, function(_b) {
                switch(_b.label){
                    case 0:
                        return [
                            4 /*yield*/ ,
                            (_a = this._bookmarkManager) === null || _a === void 0 ? void 0 : _a.getBookmarks()
                        ];
                    case 1:
                        bookmarks = _b.sent();
                        if (bookmarks === undefined) {
                            return [
                                2 /*return*/ ,
                                this._lastBookmarks
                            ];
                        }
                        return [
                            2 /*return*/ ,
                            new bookmarks_1.Bookmarks(__spreadArray(__spreadArray([], __read(bookmarks), false), __read(this._configuredBookmarks), false))
                        ];
                }
            });
        });
    };
    /**
     * Execute given unit of work in a {@link READ} transaction.
     *
     * Transaction will automatically be committed unless the given function throws or returns a rejected promise.
     * Some failures of the given function or the commit itself will be retried with exponential backoff with initial
     * delay of 1 second and maximum retry time of 30 seconds. Maximum retry time is configurable via driver config's
     * `maxTransactionRetryTime` property in milliseconds.
     *
     * NOTE: Because it is an explicit transaction from the server point of view, Cypher queries using
     * "CALL {} IN TRANSACTIONS" or the older "USING PERIODIC COMMIT" construct will not work (call
     * {@link Session#run} for these).
     *
     * @param {function(tx: ManagedTransaction): Promise} transactionWork - Callback that executes operations against
     * a given {@link Transaction}.
     * @param {TransactionConfig} [transactionConfig] - Configuration for all transactions started to execute the unit of work.
     * @return {Promise} Resolved promise as returned by the given function or rejected promise when given
     * function or commit fails.
     */ Session.prototype.executeRead = function(transactionWork, transactionConfig) {
        var config = new tx_config_1.TxConfig(transactionConfig, this._log);
        return this._executeInTransaction(constants_1.ACCESS_MODE_READ, config, transactionWork);
    };
    /**
     * Execute given unit of work in a {@link WRITE} transaction.
     *
     * Transaction will automatically be committed unless the given function throws or returns a rejected promise.
     * Some failures of the given function or the commit itself will be retried with exponential backoff with initial
     * delay of 1 second and maximum retry time of 30 seconds. Maximum retry time is configurable via driver config's
     * `maxTransactionRetryTime` property in milliseconds.
     *
     * NOTE: Because it is an explicit transaction from the server point of view, Cypher queries using
     * "CALL {} IN TRANSACTIONS" or the older "USING PERIODIC COMMIT" construct will not work (call
     * {@link Session#run} for these).
     *
     * @param {function(tx: ManagedTransaction): Promise} transactionWork - Callback that executes operations against
     * a given {@link Transaction}.
     * @param {TransactionConfig} [transactionConfig] - Configuration for all transactions started to execute the unit of work.
     * @return {Promise} Resolved promise as returned by the given function or rejected promise when given
     * function or commit fails.
     */ Session.prototype.executeWrite = function(transactionWork, transactionConfig) {
        var config = new tx_config_1.TxConfig(transactionConfig, this._log);
        return this._executeInTransaction(constants_1.ACCESS_MODE_WRITE, config, transactionWork);
    };
    /**
     * @private
     * @param {SessionMode} accessMode
     * @param {TxConfig} transactionConfig
     * @param {ManagedTransactionWork} transactionWork
     * @returns {Promise}
     */ Session.prototype._executeInTransaction = function(accessMode, transactionConfig, transactionWork) {
        var _this = this;
        return this._transactionExecutor.execute(function(apiTelemetryConfig) {
            return _this._beginTransaction(accessMode, transactionConfig, apiTelemetryConfig);
        }, transactionWork, transaction_managed_1.default.fromTransaction);
    };
    /**
     * Sets the resolved database name in the session context.
     * @private
     * @param {string|undefined} database The resolved database name
     * @returns {void}
     */ Session.prototype._onDatabaseNameResolved = function(database) {
        if (this._isRoutingSession) {
            this._databaseGuess = database;
            if (!this._databaseNameResolved) {
                var normalizedDatabase = database !== null && database !== void 0 ? database : '';
                this._database = normalizedDatabase;
                this._readConnectionHolder.setDatabase(normalizedDatabase);
                this._writeConnectionHolder.setDatabase(normalizedDatabase);
                this._databaseNameResolved = true;
                if (this._homeDatabaseCallback != null) {
                    this._homeDatabaseCallback((0, auth_util_1.cacheKey)(this._auth, this._impersonatedUser), database);
                }
            }
        }
    };
    Session.prototype._getConnectionAcquistionBookmarks = function() {
        return __awaiter(this, void 0, void 0, function() {
            var bookmarks;
            var _a;
            return __generator(this, function(_b) {
                switch(_b.label){
                    case 0:
                        return [
                            4 /*yield*/ ,
                            (_a = this._bookmarkManager) === null || _a === void 0 ? void 0 : _a.getBookmarks()
                        ];
                    case 1:
                        bookmarks = _b.sent();
                        if (bookmarks === undefined) {
                            return [
                                2 /*return*/ ,
                                this._lastBookmarks
                            ];
                        }
                        return [
                            2 /*return*/ ,
                            new bookmarks_1.Bookmarks(__spreadArray(__spreadArray([], __read(this._configuredBookmarks), false), __read(bookmarks), false))
                        ];
                }
            });
        });
    };
    /**
     * Update value of the last bookmarks.
     * @private
     * @param {Bookmarks} newBookmarks - The new bookmarks.
     * @returns {void}
     */ Session.prototype._updateBookmarks = function(newBookmarks, previousBookmarks, database) {
        var _a, _b, _c;
        if (newBookmarks != null && !newBookmarks.isEmpty()) {
            (_a = this._bookmarkManager) === null || _a === void 0 ? void 0 : _a.updateBookmarks((_b = previousBookmarks === null || previousBookmarks === void 0 ? void 0 : previousBookmarks.values()) !== null && _b !== void 0 ? _b : [], (_c = newBookmarks === null || newBookmarks === void 0 ? void 0 : newBookmarks.values()) !== null && _c !== void 0 ? _c : []).catch(function() {});
            this._lastBookmarks = newBookmarks;
            this._configuredBookmarks = bookmarks_1.Bookmarks.empty();
        }
    };
    /**
     * Close this session.
     * @return {Promise}
     */ Session.prototype.close = function() {
        return __awaiter(this, void 0, void 0, function() {
            return __generator(this, function(_a) {
                switch(_a.label){
                    case 0:
                        if (!this._open) return [
                            3 /*break*/ ,
                            3
                        ];
                        this._open = false;
                        this._results.forEach(function(result) {
                            return result._cancel();
                        });
                        this._transactionExecutor.close();
                        return [
                            4 /*yield*/ ,
                            this._readConnectionHolder.close(this._hasTx)
                        ];
                    case 1:
                        _a.sent();
                        return [
                            4 /*yield*/ ,
                            this._writeConnectionHolder.close(this._hasTx)
                        ];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        return [
                            2 /*return*/ 
                        ];
                }
            });
        });
    };
    // eslint-disable-next-line
    // @ts-ignore
    Session.prototype[Symbol.asyncDispose] = function() {
        return this.close();
    };
    Session.prototype._connectionHolderWithMode = function(mode) {
        if (mode === constants_1.ACCESS_MODE_READ) {
            return this._readConnectionHolder;
        } else if (mode === constants_1.ACCESS_MODE_WRITE) {
            return this._writeConnectionHolder;
        } else {
            throw (0, error_1.newError)('Unknown access mode: ' + mode);
        }
    };
    /**
     * @private
     * @param {Object} meta Connection metadatada
     * @returns {void}
     */ Session.prototype._onCompleteCallback = function(meta, previousBookmarks) {
        this._updateBookmarks(new bookmarks_1.Bookmarks(meta.bookmark), previousBookmarks, meta.db);
    };
    /**
     * @private
     * @returns {void}
     */ Session.prototype._calculateWatermaks = function() {
        if (this._fetchSize === constants_1.FETCH_ALL) {
            return {
                low: Number.MAX_VALUE,
                high: Number.MAX_VALUE // we shall never reach this number to disable auto pull
            };
        }
        return {
            low: 0.3 * this._fetchSize,
            high: 0.7 * this._fetchSize
        };
    };
    /**
     * Configure the transaction executor
     *
     * This used by {@link Driver#executeQuery}
     * @private
     * @returns {void}
     */ Session.prototype._configureTransactionExecutor = function(pipelined, telemetryApi) {
        this._transactionExecutor.pipelineBegin = pipelined;
        this._transactionExecutor.telemetryApi = telemetryApi;
    };
    /**
     * @protected
     */ Session._validateSessionMode = function(rawMode) {
        var mode = rawMode !== null && rawMode !== void 0 ? rawMode : constants_1.ACCESS_MODE_WRITE;
        if (mode !== constants_1.ACCESS_MODE_READ && mode !== constants_1.ACCESS_MODE_WRITE) {
            throw (0, error_1.newError)('Illegal session mode ' + mode);
        }
        return mode;
    };
    return Session;
}();
/**
 * @private
 * @param {object} config
 * @returns {TransactionExecutor} The transaction executor
 */ function _createTransactionExecutor(config) {
    var _a;
    var maxRetryTimeMs = (_a = config === null || config === void 0 ? void 0 : config.maxTransactionRetryTime) !== null && _a !== void 0 ? _a : null;
    return new transaction_executor_1.TransactionExecutor(maxRetryTimeMs);
}
exports.default = Session;
}),
"[project]/frontend/node_modules/neo4j-driver-core/lib/bookmark-manager.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/**
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [https://neo4j.com]
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ var __awaiter = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__awaiter || function(thisArg, _arguments, P, generator) {
    function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
            resolve(value);
        });
    }
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
                step(generator["throw"](value));
            } catch (e) {
                reject(e);
            }
        }
        function step(result) {
            result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__generator || function(thisArg, body) {
    var _ = {
        label: 0,
        sent: function() {
            if (t[0] & 1) throw t[1];
            return t[1];
        },
        trys: [],
        ops: []
    }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() {
        return this;
    }), g;
    //TURBOPACK unreachable
    ;
    function verb(n) {
        return function(v) {
            return step([
                n,
                v
            ]);
        };
    }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while(g && (g = 0, op[0] && (_ = 0)), _)try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [
                op[0] & 2,
                t.value
            ];
            switch(op[0]){
                case 0:
                case 1:
                    t = op;
                    break;
                case 4:
                    _.label++;
                    return {
                        value: op[1],
                        done: false
                    };
                case 5:
                    _.label++;
                    y = op[1];
                    op = [
                        0
                    ];
                    continue;
                case 7:
                    op = _.ops.pop();
                    _.trys.pop();
                    continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                        _ = 0;
                        continue;
                    }
                    if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                        _.label = op[1];
                        break;
                    }
                    if (op[0] === 6 && _.label < t[1]) {
                        _.label = t[1];
                        t = op;
                        break;
                    }
                    if (t && _.label < t[2]) {
                        _.label = t[2];
                        _.ops.push(op);
                        break;
                    }
                    if (t[2]) _.ops.pop();
                    _.trys.pop();
                    continue;
            }
            op = body.call(thisArg, _);
        } catch (e) {
            op = [
                6,
                e
            ];
            y = 0;
        } finally{
            f = t = 0;
        }
        if (op[0] & 5) throw op[1];
        return {
            value: op[0] ? op[1] : void 0,
            done: true
        };
    }
};
var __values = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__values || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function() {
            if (o && i >= o.length) o = void 0;
            return {
                value: o && o[i++],
                done: !o
            };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var __read = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__read || function(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while((n === void 0 || n-- > 0) && !(r = i.next()).done)ar.push(r.value);
    } catch (error) {
        e = {
            error: error
        };
    } finally{
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        } finally{
            if (e) throw e.error;
        }
    }
    return ar;
};
var __spreadArray = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__spreadArray || function(to, from, pack) {
    if (pack || arguments.length === 2) for(var i = 0, l = from.length, ar; i < l; i++){
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.bookmarkManager = bookmarkManager;
/**
 * Interface for the piece of software responsible for keeping track of current active bookmarks accross the driver.
 * @interface
 * @since 5.0
 */ var BookmarkManager = function() {
    /**
     * @constructor
     * @private
     */ function BookmarkManager() {
        throw new Error('Not implemented');
    }
    /**
     * Method called when the bookmarks get updated when a transaction finished.
     *
     * This method will be called when auto-commit queries finish and when explicit transactions
     * get committed.
     *
     * @param {Iterable<string>} previousBookmarks The bookmarks used when starting the transaction
     * @param {Iterable<string>} newBookmarks The new bookmarks received at the end of the transaction.
     * @returns {void}
    */ BookmarkManager.prototype.updateBookmarks = function(previousBookmarks, newBookmarks) {
        return __awaiter(this, void 0, void 0, function() {
            return __generator(this, function(_a) {
                throw new Error('Not implemented');
            });
        });
    };
    /**
     * Method called by the driver to get the bookmarks.
     *
     * @returns {Iterable<string>} The set of bookmarks
     */ BookmarkManager.prototype.getBookmarks = function() {
        return __awaiter(this, void 0, void 0, function() {
            return __generator(this, function(_a) {
                throw new Error('Not implemented');
            });
        });
    };
    return BookmarkManager;
}();
exports.default = BookmarkManager;
/**
 * @typedef {Object} BookmarkManagerConfig
 *
 * @since 5.0
 * @property {Iterable<string>} [initialBookmarks] Defines the initial set of bookmarks. The key is the database name and the values are the bookmarks.
 * @property {function():Promise<Iterable<string>>} [bookmarksSupplier] Called for supplying extra bookmarks to the BookmarkManager
 * @property {function(bookmarks: Iterable<string>): Promise<void>} [bookmarksConsumer] Called when the set of bookmarks  get updated
 */ /**
 * Provides an configured {@link BookmarkManager} instance.
 *
 * @since 5.0
 * @param {BookmarkManagerConfig} [config={}]
 * @returns {BookmarkManager}
 */ function bookmarkManager(config) {
    if (config === void 0) {
        config = {};
    }
    var initialBookmarks = new Set(config.initialBookmarks);
    return new Neo4jBookmarkManager(initialBookmarks, config.bookmarksSupplier, config.bookmarksConsumer);
}
var Neo4jBookmarkManager = function() {
    function Neo4jBookmarkManager(_bookmarks, _bookmarksSupplier, _bookmarksConsumer) {
        this._bookmarks = _bookmarks;
        this._bookmarksSupplier = _bookmarksSupplier;
        this._bookmarksConsumer = _bookmarksConsumer;
    }
    Neo4jBookmarkManager.prototype.updateBookmarks = function(previousBookmarks, newBookmarks) {
        return __awaiter(this, void 0, void 0, function() {
            var bookmarks, previousBookmarks_1, previousBookmarks_1_1, bm, newBookmarks_1, newBookmarks_1_1, bm;
            var e_1, _a, e_2, _b;
            return __generator(this, function(_c) {
                switch(_c.label){
                    case 0:
                        bookmarks = this._bookmarks;
                        try {
                            for(previousBookmarks_1 = __values(previousBookmarks), previousBookmarks_1_1 = previousBookmarks_1.next(); !previousBookmarks_1_1.done; previousBookmarks_1_1 = previousBookmarks_1.next()){
                                bm = previousBookmarks_1_1.value;
                                bookmarks.delete(bm);
                            }
                        } catch (e_1_1) {
                            e_1 = {
                                error: e_1_1
                            };
                        } finally{
                            try {
                                if (previousBookmarks_1_1 && !previousBookmarks_1_1.done && (_a = previousBookmarks_1.return)) _a.call(previousBookmarks_1);
                            } finally{
                                if (e_1) throw e_1.error;
                            }
                        }
                        try {
                            for(newBookmarks_1 = __values(newBookmarks), newBookmarks_1_1 = newBookmarks_1.next(); !newBookmarks_1_1.done; newBookmarks_1_1 = newBookmarks_1.next()){
                                bm = newBookmarks_1_1.value;
                                bookmarks.add(bm);
                            }
                        } catch (e_2_1) {
                            e_2 = {
                                error: e_2_1
                            };
                        } finally{
                            try {
                                if (newBookmarks_1_1 && !newBookmarks_1_1.done && (_b = newBookmarks_1.return)) _b.call(newBookmarks_1);
                            } finally{
                                if (e_2) throw e_2.error;
                            }
                        }
                        if (!(typeof this._bookmarksConsumer === 'function')) return [
                            3 /*break*/ ,
                            2
                        ];
                        return [
                            4 /*yield*/ ,
                            this._bookmarksConsumer(__spreadArray([], __read(bookmarks), false))
                        ];
                    case 1:
                        _c.sent();
                        _c.label = 2;
                    case 2:
                        return [
                            2 /*return*/ 
                        ];
                }
            });
        });
    };
    Neo4jBookmarkManager.prototype.getBookmarks = function() {
        return __awaiter(this, void 0, void 0, function() {
            var bookmarks, suppliedBookmarks, suppliedBookmarks_1, suppliedBookmarks_1_1, bm;
            var e_3, _a;
            var _b;
            return __generator(this, function(_c) {
                switch(_c.label){
                    case 0:
                        bookmarks = new Set(this._bookmarks);
                        if (!(typeof this._bookmarksSupplier === 'function')) return [
                            3 /*break*/ ,
                            2
                        ];
                        return [
                            4 /*yield*/ ,
                            this._bookmarksSupplier()
                        ];
                    case 1:
                        suppliedBookmarks = (_b = _c.sent()) !== null && _b !== void 0 ? _b : [];
                        try {
                            for(suppliedBookmarks_1 = __values(suppliedBookmarks), suppliedBookmarks_1_1 = suppliedBookmarks_1.next(); !suppliedBookmarks_1_1.done; suppliedBookmarks_1_1 = suppliedBookmarks_1.next()){
                                bm = suppliedBookmarks_1_1.value;
                                bookmarks.add(bm);
                            }
                        } catch (e_3_1) {
                            e_3 = {
                                error: e_3_1
                            };
                        } finally{
                            try {
                                if (suppliedBookmarks_1_1 && !suppliedBookmarks_1_1.done && (_a = suppliedBookmarks_1.return)) _a.call(suppliedBookmarks_1);
                            } finally{
                                if (e_3) throw e_3.error;
                            }
                        }
                        _c.label = 2;
                    case 2:
                        return [
                            2 /*return*/ ,
                            __spreadArray([], __read(bookmarks), false)
                        ];
                }
            });
        });
    };
    return Neo4jBookmarkManager;
}();
}),
"[project]/frontend/node_modules/neo4j-driver-core/lib/result-transformers.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/**
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [https://neo4j.com]
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ var __awaiter = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__awaiter || function(thisArg, _arguments, P, generator) {
    function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
            resolve(value);
        });
    }
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
                step(generator["throw"](value));
            } catch (e) {
                reject(e);
            }
        }
        function step(result) {
            result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__generator || function(thisArg, body) {
    var _ = {
        label: 0,
        sent: function() {
            if (t[0] & 1) throw t[1];
            return t[1];
        },
        trys: [],
        ops: []
    }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() {
        return this;
    }), g;
    //TURBOPACK unreachable
    ;
    function verb(n) {
        return function(v) {
            return step([
                n,
                v
            ]);
        };
    }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while(g && (g = 0, op[0] && (_ = 0)), _)try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [
                op[0] & 2,
                t.value
            ];
            switch(op[0]){
                case 0:
                case 1:
                    t = op;
                    break;
                case 4:
                    _.label++;
                    return {
                        value: op[1],
                        done: false
                    };
                case 5:
                    _.label++;
                    y = op[1];
                    op = [
                        0
                    ];
                    continue;
                case 7:
                    op = _.ops.pop();
                    _.trys.pop();
                    continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                        _ = 0;
                        continue;
                    }
                    if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                        _.label = op[1];
                        break;
                    }
                    if (op[0] === 6 && _.label < t[1]) {
                        _.label = t[1];
                        t = op;
                        break;
                    }
                    if (t && _.label < t[2]) {
                        _.label = t[2];
                        _.ops.push(op);
                        break;
                    }
                    if (t[2]) _.ops.pop();
                    _.trys.pop();
                    continue;
            }
            op = body.call(thisArg, _);
        } catch (e) {
            op = [
                6,
                e
            ];
            y = 0;
        } finally{
            f = t = 0;
        }
        if (op[0] & 5) throw op[1];
        return {
            value: op[0] ? op[1] : void 0,
            done: true
        };
    }
};
var __importDefault = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : {
        "default": mod
    };
};
Object.defineProperty(exports, "__esModule", {
    value: true
});
var result_eager_1 = __importDefault(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/result-eager.js [app-route] (ecmascript)"));
var error_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/error.js [app-route] (ecmascript)");
/**
 * Protocol for transforming {@link Result}.
 *
 * @typedef {function<T>(result:Result):Promise<T>} ResultTransformer
 * @interface
 *
 * @see {@link resultTransformers} for provided implementations.
 * @see {@link Driver#executeQuery} for usage.
 */ /**
 * Defines the object which holds the common {@link ResultTransformer} used with {@link Driver#executeQuery}.
 */ var ResultTransformers = function() {
    function ResultTransformers() {}
    /**
     * Creates a {@link ResultTransformer} which transforms {@link Result} to {@link EagerResult}
     * by consuming the whole stream.
     *
     * This is the default implementation used in {@link Driver#executeQuery}
     *
     * @example
     * // This:
     * const { keys, records, summary } = await driver.executeQuery('CREATE (p:Person{ name: $name }) RETURN p', { name: 'Person1'}, {
     *   resultTransformer: neo4j.resultTransformers.eagerResultTransformer()
     * })
     * // is equivalent to:
     * const { keys, records, summary } = await driver.executeQuery('CREATE (p:Person{ name: $name }) RETURN p', { name: 'Person1'})
     *
     * @returns {ResultTransformer<EagerResult<Entries>>} The result transformer
     * @deprecated This is deprecated as of 6.0, use drop-in replacement {@link ResultTransformers#eager} instead.
     */ ResultTransformers.prototype.eagerResultTransformer = function() {
        return createEagerResultFromResult;
    };
    /**
     * Creates a {@link ResultTransformer} which transforms {@link Result} to {@link EagerResult}
     * by consuming the whole stream.
     *
     * This is the default implementation used in {@link Driver#executeQuery}
     *
     * @example
     * // This:
     * const { keys, records, summary } = await driver.executeQuery('CREATE (p:Person{ name: $name }) RETURN p', { name: 'Person1'}, {
     *   resultTransformer: neo4j.resultTransformers.eager()
     * })
     * // is equivalent to:
     * const { keys, records, summary } = await driver.executeQuery('CREATE (p:Person{ name: $name }) RETURN p', { name: 'Person1'})
     *
     * @returns {ResultTransformer<EagerResult<Entries>>} The result transformer
     * @since 5.22.0
     */ ResultTransformers.prototype.eager = function() {
        return createEagerResultFromResult;
    };
    /**
     * Creates a {@link ResultTransformer} which maps the {@link Record} in the result and collects it
     * along with the {@link ResultSummary} and {@link Result#keys}.
     *
     * NOTE: The config object requires map or/and collect to be valid.
     *
     * @example
     * // Mapping the records
     * const { keys, records, summary } = await driver.executeQuery('MATCH (p:Person{ age: $age }) RETURN p.name as name', { age: 25 }, {
     *   resultTransformer: neo4j.resultTransformers.mappedResultTransformer({
     *     map(record) {
     *        return record.get('name')
     *     }
     *   })
     * })
     *
     * records.forEach(name => console.log(`${name} has 25`))
     *
     * @example
     * // Mapping records and collect result
     * const names = await driver.executeQuery('MATCH (p:Person{ age: $age }) RETURN p.name as name', { age: 25 }, {
     *   resultTransformer: neo4j.resultTransformers.mappedResultTransformer({
     *     map(record) {
     *        return record.get('name')
     *     },
     *     collect(records, summary, keys) {
     *        return records
     *     }
     *   })
     * })
     *
     * names.forEach(name => console.log(`${name} has 25`))
     *
     * @example
     * // The transformer can be defined one and used everywhere
     * const getRecordsAsObjects = neo4j.resultTransformers.mappedResultTransformer({
     *   map(record) {
     *      return record.toObject()
     *   },
     *   collect(objects) {
     *      return objects
     *   }
     * })
     *
     * // The usage in a driver.executeQuery
     * const objects = await driver.executeQuery('MATCH (p:Person{ age: $age }) RETURN p.name as name', { age: 25 }, {
     *   resultTransformer: getRecordsAsObjects
     * })
     * objects.forEach(object => console.log(`${object.name} has 25`))
     *
     *
     * // The usage in session.executeRead
     * const objects = await session.executeRead(tx => getRecordsAsObjects(tx.run('MATCH (p:Person{ age: $age }) RETURN p.name as name')))
     * objects.forEach(object => console.log(`${object.name} has 25`))
     *
     * @param {object} config The result transformer configuration
     * @param {function(record:Record):R} [config.map=function(record) {  return record }] Method called for mapping each record
     * @param {function(records:R[], summary:ResultSummary, keys:string[]):T} [config.collect=function(records, summary, keys) { return { records, summary, keys }}] Method called for mapping
     * the result data to the transformer output.
     * @returns {ResultTransformer<T>} The result transformer
     * @see {@link Driver#executeQuery}
     * @deprecated This is deprecated as of 6.0, use drop-in replacement {@link ResultTransformers#mapped} instead.
     */ ResultTransformers.prototype.mappedResultTransformer = function(config) {
        return createMappedResultTransformer(config);
    };
    /**
     * Creates a {@link ResultTransformer} which maps the {@link Record} in the result and collects it
     * along with the {@link ResultSummary} and {@link Result#keys}.
     *
     * NOTE: The config object requires map or/and collect to be valid.
     *
     * @example
     * // Mapping the records
     * const { keys, records, summary } = await driver.executeQuery('MATCH (p:Person{ age: $age }) RETURN p.name as name', { age: 25 }, {
     *   resultTransformer: neo4j.resultTransformers.mapped({
     *     map(record) {
     *        return record.get('name')
     *     }
     *   })
     * })
     *
     * records.forEach(name => console.log(`${name} has 25`))
     *
     * @example
     * // Mapping records and collect result
     * const names = await driver.executeQuery('MATCH (p:Person{ age: $age }) RETURN p.name as name', { age: 25 }, {
     *   resultTransformer: neo4j.resultTransformers.mapped({
     *     map(record) {
     *        return record.get('name')
     *     },
     *     collect(records, summary, keys) {
     *        return records
     *     }
     *   })
     * })
     *
     * names.forEach(name => console.log(`${name} has 25`))
     *
     * @example
     * // The transformer can be defined one and used everywhere
     * const getRecordsAsObjects = neo4j.resultTransformers.mapped({
     *   map(record) {
     *      return record.toObject()
     *   },
     *   collect(objects) {
     *      return objects
     *   }
     * })
     *
     * // The usage in a driver.executeQuery
     * const objects = await driver.executeQuery('MATCH (p:Person{ age: $age }) RETURN p.name as name', { age: 25 }, {
     *   resultTransformer: getRecordsAsObjects
     * })
     * objects.forEach(object => console.log(`${object.name} has 25`))
     *
     *
     * // The usage in session.executeRead
     * const objects = await session.executeRead(tx => getRecordsAsObjects(tx.run('MATCH (p:Person{ age: $age }) RETURN p.name as name')))
     * objects.forEach(object => console.log(`${object.name} has 25`))
     *
     * @param {object} config The result transformer configuration
     * @param {function(record:Record):R} [config.map=function(record) {  return record }] Method called for mapping each record
     * @param {function(records:R[], summary:ResultSummary, keys:string[]):T} [config.collect=function(records, summary, keys) { return { records, summary, keys }}] Method called for mapping
     * the result data to the transformer output.
     * @returns {ResultTransformer<T>} The result transformer
     * @see {@link Driver#executeQuery}
     * @since 5.22.0
     */ ResultTransformers.prototype.mapped = function(config) {
        return createMappedResultTransformer(config);
    };
    /**
     * Creates a {@link ResultTransformer} which collects the first record {@link Record} of {@link Result}
     * and discard the rest of the records, if existent.
     *
     * @example
     * // Using in executeQuery
     * const maybeFirstRecord = await driver.executeQuery('MATCH (p:Person{ age: $age }) RETURN p.name as name', { age: 25 }, {
     *   resultTransformer: neo4j.resultTransformers.first()
     * })
     *
     * @example
     * // Using in other results
     * const record = await neo4j.resultTransformers.first()(result)
     *
     *
     * @template Entries The shape of the record.
     * @returns {ResultTransformer<Record<Entries>|undefined>} The result transformer
     * @see {@link Driver#executeQuery}
     * @since 5.22.0
     */ ResultTransformers.prototype.first = function() {
        return first;
    };
    /**
     * Creates a {@link ResultTransformer} which consumes the result and returns the {@link ResultSummary}.
     *
     * This result transformer is a shortcut to `(result) => result.summary()`.
     *
     * @example
     * const summary = await driver.executeQuery('CREATE (p:Person{ name: $name }) RETURN p', { name: 'Person1'}, {
     *   resultTransformer: neo4j.resultTransformers.summary()
     * })
     *
     * @returns {ResultTransformer<ResultSummary<T>>} The result transformer
     * @see {@link Driver#executeQuery}
     * @since 5.22.0
     */ ResultTransformers.prototype.summary = function() {
        return summary;
    };
    /**
     * Creates a {@link ResultTransformer} which maps each record of the result to a hydrated object of a provided type and/or according to provided rules.
     *
     * @example
     *
     * class Person {
     *   constructor (name) {
     *     this.name = name
     * }
     *
     * const personRules: Rules = {
     *    name: neo4j.rule.asString()
     * }
     *
     * const summary = await driver.executeQuery('CREATE (p:Person{ name: $name }) RETURN p', { name: 'Person1'}, {
     *   resultTransformer: neo4j.resultTransformers.hydrated(Person, personClassRules)
     * })
     *
     * // Alternatively, the rules can be registered in the mapping registry.
     * // This registry exists in global memory and will persist even between driver instances.
     *
     * neo4j.RecordObjectMapping.register(Person, PersonRules)
     *
     * // after registering the rule the transformer will follow them when mapping to the provided type
     * const summary = await driver.executeQuery('CREATE (p:Person{ name: $name }) RETURN p', { name: 'Person1'}, {
     *   resultTransformer: neo4j.resultTransformers.hydrated(Person)
     * })
     *
     * // A hydrated can be used without providing or registering Rules beforehand, but in such case the mapping will be done without any type validation
     *
     * @returns {ResultTransformer<ResultSummary<T>>} The result transformer
     * @see {@link Driver#executeQuery}
     * @experimental Part of the Record Object Mapping preview feature
     */ ResultTransformers.prototype.hydrated = function(constructorOrRules, rules) {
        var _this = this;
        return function(result) {
            return __awaiter(_this, void 0, void 0, function() {
                return __generator(this, function(_a) {
                    switch(_a.label){
                        case 0:
                            return [
                                4 /*yield*/ ,
                                result.as(constructorOrRules, rules).then()
                            ];
                        case 1:
                            return [
                                2 /*return*/ ,
                                _a.sent()
                            ];
                    }
                });
            });
        };
    };
    return ResultTransformers;
}();
/**
 * Holds the common {@link ResultTransformer} used with {@link Driver#executeQuery}.
 */ var resultTransformers = new ResultTransformers();
Object.freeze(resultTransformers);
exports.default = resultTransformers;
function createEagerResultFromResult(result) {
    return __awaiter(this, void 0, void 0, function() {
        var _a, summary, records, keys;
        return __generator(this, function(_b) {
            switch(_b.label){
                case 0:
                    return [
                        4 /*yield*/ ,
                        result
                    ];
                case 1:
                    _a = _b.sent(), summary = _a.summary, records = _a.records;
                    return [
                        4 /*yield*/ ,
                        result.keys()
                    ];
                case 2:
                    keys = _b.sent();
                    return [
                        2 /*return*/ ,
                        new result_eager_1.default(keys, records, summary)
                    ];
            }
        });
    });
}
function createMappedResultTransformer(config) {
    var _this = this;
    if (config == null || config.collect == null && config.map == null) {
        throw (0, error_1.newError)('Requires a map or/and a collect functions.');
    }
    return function(result) {
        return __awaiter(_this, void 0, void 0, function() {
            return __generator(this, function(_a) {
                switch(_a.label){
                    case 0:
                        return [
                            4 /*yield*/ ,
                            new Promise(function(resolve, reject) {
                                var state = {
                                    records: [],
                                    keys: []
                                };
                                result.subscribe({
                                    onKeys: function(keys) {
                                        state.keys = keys;
                                    },
                                    onNext: function(record) {
                                        if (config.map != null) {
                                            var mappedRecord = config.map(record);
                                            if (mappedRecord !== undefined) {
                                                state.records.push(mappedRecord);
                                            }
                                        } else {
                                            state.records.push(record);
                                        }
                                    },
                                    onCompleted: function(summary) {
                                        if (config.collect != null) {
                                            resolve(config.collect(state.records, summary, state.keys));
                                        } else {
                                            var obj = {
                                                records: state.records,
                                                summary: summary,
                                                keys: state.keys
                                            };
                                            resolve(obj);
                                        }
                                    },
                                    onError: function(error) {
                                        reject(error);
                                    }
                                });
                            })
                        ];
                    case 1:
                        return [
                            2 /*return*/ ,
                            _a.sent()
                        ];
                }
            });
        });
    };
}
function first(result) {
    return __awaiter(this, void 0, void 0, function() {
        var it, _a, value, done;
        return __generator(this, function(_b) {
            switch(_b.label){
                case 0:
                    it = result[Symbol.asyncIterator]();
                    return [
                        4 /*yield*/ ,
                        it.next()
                    ];
                case 1:
                    _a = _b.sent(), value = _a.value, done = _a.done;
                    _b.label = 2;
                case 2:
                    _b.trys.push([
                        2,
                        ,
                        3,
                        6
                    ]);
                    if (done === true) {
                        return [
                            2 /*return*/ ,
                            undefined
                        ];
                    }
                    return [
                        2 /*return*/ ,
                        value
                    ];
                case 3:
                    if (!(it.return != null)) return [
                        3 /*break*/ ,
                        5
                    ];
                    return [
                        4 /*yield*/ ,
                        it.return()
                    ];
                case 4:
                    _b.sent();
                    _b.label = 5;
                case 5:
                    return [
                        7 /*endfinally*/ 
                    ];
                case 6:
                    return [
                        2 /*return*/ 
                    ];
            }
        });
    });
}
function summary(result) {
    return __awaiter(this, void 0, void 0, function() {
        return __generator(this, function(_a) {
            switch(_a.label){
                case 0:
                    return [
                        4 /*yield*/ ,
                        result.summary()
                    ];
                case 1:
                    return [
                        2 /*return*/ ,
                        _a.sent()
                    ];
            }
        });
    });
}
}),
"[project]/frontend/node_modules/neo4j-driver-core/lib/internal/query-executor.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/**
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [https://neo4j.com]
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ var __awaiter = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__awaiter || function(thisArg, _arguments, P, generator) {
    function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
            resolve(value);
        });
    }
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
                step(generator["throw"](value));
            } catch (e) {
                reject(e);
            }
        }
        function step(result) {
            result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__generator || function(thisArg, body) {
    var _ = {
        label: 0,
        sent: function() {
            if (t[0] & 1) throw t[1];
            return t[1];
        },
        trys: [],
        ops: []
    }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() {
        return this;
    }), g;
    //TURBOPACK unreachable
    ;
    function verb(n) {
        return function(v) {
            return step([
                n,
                v
            ]);
        };
    }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while(g && (g = 0, op[0] && (_ = 0)), _)try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [
                op[0] & 2,
                t.value
            ];
            switch(op[0]){
                case 0:
                case 1:
                    t = op;
                    break;
                case 4:
                    _.label++;
                    return {
                        value: op[1],
                        done: false
                    };
                case 5:
                    _.label++;
                    y = op[1];
                    op = [
                        0
                    ];
                    continue;
                case 7:
                    op = _.ops.pop();
                    _.trys.pop();
                    continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                        _ = 0;
                        continue;
                    }
                    if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                        _.label = op[1];
                        break;
                    }
                    if (op[0] === 6 && _.label < t[1]) {
                        _.label = t[1];
                        t = op;
                        break;
                    }
                    if (t && _.label < t[2]) {
                        _.label = t[2];
                        _.ops.push(op);
                        break;
                    }
                    if (t[2]) _.ops.pop();
                    _.trys.pop();
                    continue;
            }
            op = body.call(thisArg, _);
        } catch (e) {
            op = [
                6,
                e
            ];
            y = 0;
        } finally{
            f = t = 0;
        }
        if (op[0] & 5) throw op[1];
        return {
            value: op[0] ? op[1] : void 0,
            done: true
        };
    }
};
Object.defineProperty(exports, "__esModule", {
    value: true
});
var constants_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/internal/constants.js [app-route] (ecmascript)");
var QueryExecutor = function() {
    function QueryExecutor(_createSession) {
        this._createSession = _createSession;
    }
    QueryExecutor.prototype.execute = function(config, query, parameters) {
        return __awaiter(this, void 0, void 0, function() {
            var session, listenerHandle, executeInTransaction;
            var _this = this;
            return __generator(this, function(_a) {
                switch(_a.label){
                    case 0:
                        session = this._createSession({
                            database: config.database,
                            bookmarkManager: config.bookmarkManager,
                            impersonatedUser: config.impersonatedUser,
                            auth: config.auth
                        });
                        listenerHandle = installEventListenerWhenPossible(// Solving linter and types definitions issue
                        config.signal, 'abort', function() {
                            return __awaiter(_this, void 0, void 0, function() {
                                return __generator(this, function(_a) {
                                    switch(_a.label){
                                        case 0:
                                            return [
                                                4 /*yield*/ ,
                                                session.close()
                                            ];
                                        case 1:
                                            return [
                                                2 /*return*/ ,
                                                _a.sent()
                                            ];
                                    }
                                });
                            });
                        });
                        // @ts-expect-error The method is private for external users
                        session._configureTransactionExecutor(true, constants_1.TELEMETRY_APIS.EXECUTE_QUERY);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([
                            1,
                            ,
                            3,
                            5
                        ]);
                        executeInTransaction = config.routing === 'READ' ? session.executeRead.bind(session) : session.executeWrite.bind(session);
                        return [
                            4 /*yield*/ ,
                            executeInTransaction(function(tx) {
                                return __awaiter(_this, void 0, void 0, function() {
                                    var result;
                                    return __generator(this, function(_a) {
                                        switch(_a.label){
                                            case 0:
                                                result = tx.run(query, parameters);
                                                return [
                                                    4 /*yield*/ ,
                                                    config.resultTransformer(result)
                                                ];
                                            case 1:
                                                return [
                                                    2 /*return*/ ,
                                                    _a.sent()
                                                ];
                                        }
                                    });
                                });
                            }, config.transactionConfig)
                        ];
                    case 2:
                        return [
                            2 /*return*/ ,
                            _a.sent()
                        ];
                    case 3:
                        listenerHandle.uninstall();
                        return [
                            4 /*yield*/ ,
                            session.close()
                        ];
                    case 4:
                        _a.sent();
                        return [
                            7 /*endfinally*/ 
                        ];
                    case 5:
                        return [
                            2 /*return*/ 
                        ];
                }
            });
        });
    };
    return QueryExecutor;
}();
exports.default = QueryExecutor;
function installEventListenerWhenPossible(target, event, listener) {
    if (typeof (target === null || target === void 0 ? void 0 : target.addEventListener) === 'function') {
        target.addEventListener(event, listener);
    }
    return {
        uninstall: function() {
            if (typeof (target === null || target === void 0 ? void 0 : target.removeEventListener) === 'function') {
                target.removeEventListener(event, listener);
            }
        }
    };
}
}),
"[project]/frontend/node_modules/neo4j-driver-core/lib/internal/homedb-cache.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/**
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [https://neo4j.com]
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ Object.defineProperty(exports, "__esModule", {
    value: true
});
/**
 * Cache which maps users to their last known home database, along with the last time the entry was accessed.
 *
 * @private
 */ var HomeDatabaseCache = function() {
    function HomeDatabaseCache(maxSize) {
        this.maxSize = maxSize;
        this.pruneCount = Math.max(Math.round(0.01 * maxSize * Math.log(maxSize)), 1);
        this.map = new Map();
    }
    /**
     * Updates or adds an entry to the cache, and prunes the cache if above the maximum allowed size
     *
     * @param {string} user cache key for the user to set
     * @param {string} database new home database to set for the user
     */ HomeDatabaseCache.prototype.set = function(user, database) {
        this.map.set(user, {
            database: database,
            lastUsed: Date.now()
        });
        this._pruneCache();
    };
    /**
     * retrieves the last known home database for a user
     *
     * @param {string} user cache key for the user to get
     */ HomeDatabaseCache.prototype.get = function(user) {
        var value = this.map.get(user);
        if (value !== undefined) {
            value.lastUsed = Date.now();
            return value.database;
        }
        return undefined;
    };
    /**
     * removes the entry for a given user in the cache
     *
     * @param {string} user cache key for the user to remove
     */ HomeDatabaseCache.prototype.delete = function(user) {
        this.map.delete(user);
    };
    /**
     * Removes a number of the oldest entries in the cache if the number of entries has exceeded the maximum size.
     */ HomeDatabaseCache.prototype._pruneCache = function() {
        if (this.map.size > this.maxSize) {
            var sortedArray = Array.from(this.map.entries()).sort(function(a, b) {
                return a[1].lastUsed - b[1].lastUsed;
            });
            for(var i = 0; i < this.pruneCount; i++){
                this.map.delete(sortedArray[i][0]);
            }
        }
    };
    return HomeDatabaseCache;
}();
exports.default = HomeDatabaseCache;
}),
"[project]/frontend/node_modules/neo4j-driver-core/lib/driver.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __assign = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__assign || function() {
    __assign = Object.assign || function(t) {
        for(var s, i = 1, n = arguments.length; i < n; i++){
            s = arguments[i];
            for(var p in s)if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__awaiter || function(thisArg, _arguments, P, generator) {
    function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
            resolve(value);
        });
    }
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
                step(generator["throw"](value));
            } catch (e) {
                reject(e);
            }
        }
        function step(result) {
            result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__generator || function(thisArg, body) {
    var _ = {
        label: 0,
        sent: function() {
            if (t[0] & 1) throw t[1];
            return t[1];
        },
        trys: [],
        ops: []
    }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() {
        return this;
    }), g;
    //TURBOPACK unreachable
    ;
    function verb(n) {
        return function(v) {
            return step([
                n,
                v
            ]);
        };
    }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while(g && (g = 0, op[0] && (_ = 0)), _)try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [
                op[0] & 2,
                t.value
            ];
            switch(op[0]){
                case 0:
                case 1:
                    t = op;
                    break;
                case 4:
                    _.label++;
                    return {
                        value: op[1],
                        done: false
                    };
                case 5:
                    _.label++;
                    y = op[1];
                    op = [
                        0
                    ];
                    continue;
                case 7:
                    op = _.ops.pop();
                    _.trys.pop();
                    continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                        _ = 0;
                        continue;
                    }
                    if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                        _.label = op[1];
                        break;
                    }
                    if (op[0] === 6 && _.label < t[1]) {
                        _.label = t[1];
                        t = op;
                        break;
                    }
                    if (t && _.label < t[2]) {
                        _.label = t[2];
                        _.ops.push(op);
                        break;
                    }
                    if (t[2]) _.ops.pop();
                    _.trys.pop();
                    continue;
            }
            op = body.call(thisArg, _);
        } catch (e) {
            op = [
                6,
                e
            ];
            y = 0;
        } finally{
            f = t = 0;
        }
        if (op[0] & 5) throw op[1];
        return {
            value: op[0] ? op[1] : void 0,
            done: true
        };
    }
};
var __importDefault = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : {
        "default": mod
    };
};
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.QueryConfig = exports.SessionConfig = exports.routing = exports.WRITE = exports.READ = exports.Driver = void 0;
var bookmarks_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/internal/bookmarks.js [app-route] (ecmascript)");
var configured_custom_resolver_1 = __importDefault(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/internal/resolver/configured-custom-resolver.js [app-route] (ecmascript)"));
var constants_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/internal/constants.js [app-route] (ecmascript)");
var logger_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/internal/logger.js [app-route] (ecmascript)");
var session_1 = __importDefault(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/session.js [app-route] (ecmascript)"));
var util_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/internal/util.js [app-route] (ecmascript)");
var bookmark_manager_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/bookmark-manager.js [app-route] (ecmascript)");
var result_transformers_1 = __importDefault(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/result-transformers.js [app-route] (ecmascript)"));
var query_executor_1 = __importDefault(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/internal/query-executor.js [app-route] (ecmascript)"));
var error_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/error.js [app-route] (ecmascript)");
var homedb_cache_1 = __importDefault(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/internal/homedb-cache.js [app-route] (ecmascript)"));
var auth_util_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/internal/auth-util.js [app-route] (ecmascript)");
var DEFAULT_MAX_CONNECTION_LIFETIME = 60 * 60 * 1000; // 1 hour
/**
 * The default record fetch size. This is used in Bolt V4 protocol to pull query execution result in batches.
 * @type {number}
 */ var DEFAULT_FETCH_SIZE = 1000;
/**
 * The maximum number of entries allowed in the home database cache before pruning.
 */ var HOMEDB_CACHE_MAX_SIZE = 10000;
/**
 * Constant that represents read session access mode.
 * Should be used like this: `driver.session({ defaultAccessMode: neo4j.session.READ })`.
 * @type {string}
 */ var READ = constants_1.ACCESS_MODE_READ;
exports.READ = READ;
/**
 * Constant that represents write session access mode.
 * Should be used like this: `driver.session({ defaultAccessMode: neo4j.session.WRITE })`.
 * @type {string}
 */ var WRITE = constants_1.ACCESS_MODE_WRITE;
exports.WRITE = WRITE;
var idGenerator = 0;
/**
 * The session configuration
 *
 * @interface
 */ var SessionConfig = function() {
    /**
     * @constructor
     * @private
     */ function SessionConfig() {
        /**
         * The access mode of this session, allowed values are {@link READ} and {@link WRITE}.
         * **Default**: {@link WRITE}
         * @type {string}
         */ this.defaultAccessMode = WRITE;
        /**
         * The initial reference or references to some previous
         * transactions. Value is optional and absence indicates that that the bookmarks do not exist or are unknown.
         * @type {string|string[]|undefined}
         */ this.bookmarks = [];
        /**
         * The database this session will operate on.
         *
         * This option has no explicit value by default, but it is recommended to set
         * one if the target database is known in advance. This has the benefit of
         * ensuring a consistent target database name throughout the session in a
         * straightforward way and potentially simplifies driver logic as well as
         * reduces network communication resulting in better performance.
         *
         * Usage of Cypher clauses like USE is not a replacement for this option.
         * The driver does not parse any Cypher.
         *
         * When no explicit name is set, the driver behavior depends on the connection
         * URI scheme supplied to the driver on instantiation and Bolt protocol
         * version.
         *
         * Specifically, the following applies:
         *
         * - **bolt schemes** - queries are dispatched to the server for execution
         *   without explicit database name supplied, meaning that the target database
         *   name for query execution is determined by the server. It is important to
         *   note that the target database may change (even within the same session),
         *   for instance if the user's home database is changed on the server.
         *
         * - **neo4j schemes** - providing that Bolt protocol version 4.4, which was
         *   introduced with Neo4j server 4.4, or above is available, the driver
         *   fetches the user's home database name from the server on first query
         *   execution within the session and uses the fetched database name
         *   explicitly for all queries executed within the session. This ensures that
         *   the database name remains consistent within the given session. For
         *   instance, if the user's home database name is 'movies' and the server
         *   supplies it to the driver upon database name fetching for the session,
         *   all queries within that session are executed with the explicit database
         *   name 'movies' supplied. Any change to the user’s home database is
         *   reflected only in sessions created after such change takes effect. This
         *   behavior requires additional network communication. In clustered
         *   environments, it is strongly recommended to avoid a single point of
         *   failure. For instance, by ensuring that the connection URI resolves to
         *   multiple endpoints. For older Bolt protocol versions the behavior is the
         *   same as described for the **bolt schemes** above.
         *
         * @type {string|undefined}
         */ this.database = '';
        /**
         * The username which the user wants to impersonate for the duration of the session.
         *
         * @type {string|undefined}
         */ this.impersonatedUser = undefined;
        /**
         * The {@link AuthToken} which will be used for the duration of the session.
         *
         * By default, the session will use connections authenticated with the {@link AuthToken} configured on
         * driver creation. This configuration allows switching user and/or authorization information for the
         * session lifetime.
         *
         * **Warning**: This option is only available when the driver is connected to Neo4j Database servers
         * which supports Bolt 5.1 or newer.
         *
         * @type {AuthToken|undefined}
         * @see {@link driver}
         */ this.auth = undefined;
        /**
         * The record fetch size of each batch of this session.
         *
         * Use {@link FETCH_ALL} to always pull all records in one batch. This will override the config value set on driver config.
         *
         * @type {number|undefined}
         */ this.fetchSize = undefined;
        /**
         * Configure a BookmarkManager for the session to use
         *
         * A BookmarkManager is a piece of software responsible for keeping casual consistency between different sessions by sharing bookmarks
         * between the them.
         * Enabling it is done by supplying an BookmarkManager implementation instance to this param.
         * A default implementation could be acquired by calling the factory function {@link bookmarkManager}.
         *
         * **Warning**: Sharing the same BookmarkManager instance across multiple sessions can have a negative impact
         * on performance since all the queries will wait for the latest changes being propagated across the cluster.
         * For keeping consistency between a group of queries, use {@link Session} for grouping them.
         * For keeping consistency between a group of sessions, use {@link BookmarkManager} instance for grouping them.
         *
         * @example
         * const bookmarkManager = neo4j.bookmarkManager()
         * const linkedSession1 = driver.session({ database:'neo4j', bookmarkManager })
         * const linkedSession2 = driver.session({ database:'neo4j', bookmarkManager })
         * const unlinkedSession = driver.session({ database:'neo4j' })
         *
         * // Creating Driver User
         * const createUserQueryResult = await linkedSession1.run('CREATE (p:Person {name: $name})', { name: 'Driver User'})
         *
         * // Reading Driver User will *NOT* wait of the changes being propagated to the server before RUN the query
         * // So the 'Driver User' person might not exist in the Result
         * const unlinkedReadResult = await unlinkedSession.run('CREATE (p:Person {name: $name}) RETURN p', { name: 'Driver User'})
         *
         * // Reading Driver User will wait of the changes being propagated to the server before RUN the query
         * // So the 'Driver User' person should exist in the Result, unless deleted.
         * const linkedResult = await linkedSession2.run('CREATE (p:Person {name: $name}) RETURN p', { name: 'Driver User'})
         *
         * await linkedSession1.close()
         * await linkedSession2.close()
         * await unlinkedSession.close()
         *
         * @type {BookmarkManager|undefined}
         * @since 5.0
         */ this.bookmarkManager = undefined;
        /**
         * Configure filter for {@link gqlStatusObjects} notification returned in {@link ResultSummary#gqlStatusObjects}.
         *
         * This configuration enables filter notifications by:
         *
         * * the minimum severity level ({@link NotificationFilterMinimumSeverityLevel})
         * * disabling notification classification ({@link NotificationFilterDisabledClassification})
         *
         *
         * Disabling notifications can be done by defining the minimum severity level to 'OFF'.
         * At driver level, when omitted, uses the server's default.
         * At session level, when omitted, defaults to what filters have been configured at driver level.
         *
         * Disabling classifications or severities allows the server to skip analysis for those, which can speed up query
         * execution.
         *
         * @example
         * // enabling warning notification, but disabling `HINT` and `DEPRECATION` notifications.
         * const session = driver.session({
         *     database: 'neo4j',
         *     notificationFilter: {
         *         minimumSeverityLevel: neo4j.notificationFilterMinimumSeverityLevel.WARNING, // or 'WARNING
         *         disabledClassifications: [
         *             neo4j.notificationFilterDisabledClassification.HINT, // or 'HINT'
         *             neo4j.notificationFilterDisabledClassification.DEPRECATION // or 'DEPRECATION'
         *        ]
         *     }
         * })
         *
         * @example
         * // disabling notifications for a session
         * const session = driver.session({
         *     database: 'neo4j',
         *     notificationFilter: {
         *         minimumSeverityLevel: neo4j.notificationFilterMinimumSeverityLevel.OFF // or 'OFF'
         *     }
         * })
         *
         * @example
         * // using default values configured in the driver
         * const sessionWithDefaultValues = driver.session({ database: 'neo4j' })
         * // or driver.session({ database: 'neo4j', notificationFilter: undefined })
         *
         * // using default minimum severity level, but disabling 'HINT' and 'UNRECOGNIZED'
         * // notification classifications
         * const sessionWithDefaultSeverityLevel = driver.session({
         *     database: 'neo4j',
         *     notificationFilter: {
         *         disabledClassifications: [
         *             neo4j.notificationFilterDisabledClassification.HINT, // or 'HINT'
         *             neo4j.notificationFilterDisabledClassification.UNRECOGNIZED // or 'UNRECOGNIZED'
         *        ]
         *     }
         * })
         *
         * // using default disabled classifications, but configuring minimum severity level to 'WARNING'
         * const sessionWithDefaultSeverityLevel = driver.session({
         *     database: 'neo4j',
         *     notificationFilter: {
         *         minimumSeverityLevel: neo4j.notificationFilterMinimumSeverityLevel.WARNING // or 'WARNING'
         *     }
         * })
         *
         * @type {NotificationFilter|undefined}
         * @since 5.7
         */ this.notificationFilter = undefined;
    }
    return SessionConfig;
}();
exports.SessionConfig = SessionConfig;
var ROUTING_WRITE = 'WRITE';
var ROUTING_READ = 'READ';
/**
 * @typedef {'WRITE'|'READ'} RoutingControl
 */ /**
 * Constants that represents routing modes.
 *
 * @example
 * driver.executeQuery("<QUERY>", <PARAMETERS>, { routing: neo4j.routing.WRITE })
 */ var routing = {
    WRITE: ROUTING_WRITE,
    READ: ROUTING_READ
};
exports.routing = routing;
Object.freeze(routing);
/**
 * The query configuration
 * @interface
 */ var QueryConfig = function() {
    /**
     * @constructor
     * @private
     */ function QueryConfig() {
        /**
         * Define the type of cluster member the query will be routed to.
         *
         * @type {RoutingControl}
         */ this.routing = routing.WRITE;
        /**
         * Define the transformation will be applied to the Result before return from the
         * query method.
         *
         * @type {ResultTransformer}
         * @see {@link resultTransformers} for provided implementations.
         */ this.resultTransformer = undefined;
        /**
         * The database this session will operate on.
         *
         * @type {string|undefined}
         */ this.database = '';
        /**
         * The username which the user wants to impersonate for the duration of the query.
         *
         * @type {string|undefined}
         */ this.impersonatedUser = undefined;
        /**
         * Configure a BookmarkManager for the session to use
         *
         * A BookmarkManager is a piece of software responsible for keeping casual consistency between different pieces of work by sharing bookmarks
         * between the them.
         *
         * By default, it uses the driver's non mutable driver level bookmark manager. See, {@link Driver.executeQueryBookmarkManager}
         *
         * Can be set to null to disable causal chaining.
         * @type {BookmarkManager|undefined|null}
         */ this.bookmarkManager = undefined;
        /**
         * Configuration for all transactions started to execute the query.
         *
         * @type {TransactionConfig|undefined}
         *
         */ this.transactionConfig = undefined;
        /**
         * The {@link AuthToken} which will be used for executing the query.
         *
         * By default, the query executor will use connections authenticated with the {@link AuthToken} configured on
         * driver creation. This configuration allows switching user and/or authorization information for the
         * underlying transaction's lifetime.
         *
         * **Warning**: This option is only available when the driver is connected to Neo4j Database servers
         * which support Bolt 5.1 or newer.
         *
         * @type {AuthToken|undefined}
         * @see {@link driver}
         */ this.auth = undefined;
        /**
         * The {@link AbortSignal} for aborting query execution.
         *
         * When aborted, the signal triggers the result consumption cancelation and
         * transactions are reset. However, due to race conditions,
         * there is no guarantee the transaction will be rolled back.
         * Equivalent to {@link Session.close}
         *
         * **Warning**: This option is only available in runtime which supports AbortSignal.addEventListener.
         *
         * @since 5.22.0
         * @type {AbortSignal|undefined}
         * @experimental
         * @see https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
         */ this.signal = undefined;
    }
    return QueryConfig;
}();
exports.QueryConfig = QueryConfig;
/**
 * A driver maintains one or more {@link Session}s with a remote
 * Neo4j instance. Through the {@link Session}s you can send queries
 * and retrieve results from the database.
 *
 * Drivers are reasonably expensive to create - you should strive to keep one
 * driver instance around per Neo4j Instance you connect to.
 *
 * @access public
 */ var Driver = function() {
    /**
     * You should not be calling this directly, instead use {@link driver}.
     * @constructor
     * @protected
     * @param {Object} meta Metainformation about the driver
     * @param {Object} config
     * @param {function(id: number, config:Object, log:Logger, hostNameResolver: ConfiguredCustomResolver): ConnectionProvider } createConnectionProvider Creates the connection provider
     * @param {function(args): Session } createSession Creates the a session
    */ function Driver(meta, config, createConnectionProvider, createSession, createQueryExecutor) {
        if (config === void 0) {
            config = {};
        }
        if (createSession === void 0) {
            createSession = function(args) {
                return new session_1.default(args);
            };
        }
        if (createQueryExecutor === void 0) {
            createQueryExecutor = function(createSession) {
                return new query_executor_1.default(createSession);
            };
        }
        sanitizeConfig(config);
        var log = logger_1.Logger.create(config);
        validateConfig(config, log);
        this._id = idGenerator++;
        this._meta = meta;
        this._config = config;
        this._log = log;
        this._createConnectionProvider = createConnectionProvider;
        this._createSession = createSession;
        this._defaultExecuteQueryBookmarkManager = (0, bookmark_manager_1.bookmarkManager)();
        this._queryExecutor = createQueryExecutor(this.session.bind(this));
        /**
         * Reference to the connection provider. Initialized lazily by {@link _getOrCreateConnectionProvider}.
         * @type {ConnectionProvider}
         * @protected
         */ this._connectionProvider = null;
        /**
         * @private
         */ this.homeDatabaseCache = new homedb_cache_1.default(HOMEDB_CACHE_MAX_SIZE);
        this._afterConstruction();
    }
    Object.defineProperty(Driver.prototype, "executeQueryBookmarkManager", {
        /**
         * The bookmark managed used by {@link Driver.executeQuery}
         *
         * @type {BookmarkManager}
         */ get: function() {
            return this._defaultExecuteQueryBookmarkManager;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Executes a query in a retryable context and returns a {@link EagerResult}.
     *
     * This method is a shortcut for a {@link Session#executeRead} and {@link Session#executeWrite}.
     *
     * NOTE: Because it is an explicit transaction from the server point of view, Cypher queries using
     * "CALL {} IN TRANSACTIONS" or the older "USING PERIODIC COMMIT" construct will not work (call
     * {@link Session#run} for these).
     *
     * @example
     * // Run a simple write query
     * const { keys, records, summary } = await driver.executeQuery('CREATE (p:Person{ name: $name }) RETURN p', { name: 'Person1'})
     *
     * @example
     * // Run a read query
     * const { keys, records, summary } = await driver.executeQuery(
     *    'MATCH (p:Person{ name: $name }) RETURN p',
     *    { name: 'Person1'},
     *    { routing: neo4j.routing.READ})
     *
     * @example
     * // Run a read query returning a Person Nodes per elementId
     * const peopleMappedById = await driver.executeQuery(
     *    'MATCH (p:Person{ name: $name }) RETURN p',
     *    { name: 'Person1'},
     *    {
     *      resultTransformer: neo4j.resultTransformers.mapped({
     *        map(record) {
     *          const p = record.get('p')
     *          return [p.elementId, p]
     *        },
     *        collect(elementIdPersonPairArray) {
     *          return new Map(elementIdPersonPairArray)
     *        }
     *      })
     *    }
     * )
     *
     * const person = peopleMappedById.get("<ELEMENT_ID>")
     *
     * @example
     * // these lines
     * const transformedResult = await driver.executeQuery(
     *    "<QUERY>",
     *    <PARAMETERS>,
     *    {
     *       routing: neo4j.routing.WRITE,
     *       resultTransformer: transformer,
     *       database: "<DATABASE>",
     *       impersonatedUser: "<USER>",
     *       bookmarkManager: bookmarkManager
     *    })
     * // are equivalent to those
     * const session = driver.session({
     *    database: "<DATABASE>",
     *    impersonatedUser: "<USER>",
     *    bookmarkManager: bookmarkManager
     * })
     *
     * try {
     *    const transformedResult = await session.executeWrite(tx => {
     *        const result = tx.run("<QUERY>", <PARAMETERS>)
     *        return transformer(result)
     *    })
     * } finally {
     *    await session.close()
     * }
     *
     * @public
     * @param {string | {text: string, parameters?: object}} query - Cypher query to execute
     * @param {Object} parameters - Map with parameters to use in the query
     * @param {QueryConfig<T>} config - The query configuration
     * @returns {Promise<T>}
     *
     * @see {@link resultTransformers} for provided result transformers.
     */ Driver.prototype.executeQuery = function(query_1, parameters_1) {
        return __awaiter(this, arguments, void 0, function(query, parameters, config) {
            var bookmarkManager, resultTransformer, routingConfig;
            var _a, _b, _c;
            if (config === void 0) {
                config = {};
            }
            return __generator(this, function(_d) {
                switch(_d.label){
                    case 0:
                        bookmarkManager = config.bookmarkManager === null ? undefined : (_a = config.bookmarkManager) !== null && _a !== void 0 ? _a : this.executeQueryBookmarkManager;
                        resultTransformer = (_b = config.resultTransformer) !== null && _b !== void 0 ? _b : result_transformers_1.default.eager();
                        routingConfig = (_c = config.routing) !== null && _c !== void 0 ? _c : routing.WRITE;
                        if (routingConfig !== routing.READ && routingConfig !== routing.WRITE) {
                            throw (0, error_1.newError)("Illegal query routing config: \"".concat(routingConfig, "\""));
                        }
                        return [
                            4 /*yield*/ ,
                            this._queryExecutor.execute({
                                resultTransformer: resultTransformer,
                                bookmarkManager: bookmarkManager,
                                routing: routingConfig,
                                database: config.database,
                                impersonatedUser: config.impersonatedUser,
                                transactionConfig: config.transactionConfig,
                                auth: config.auth,
                                signal: config.signal
                            }, query, parameters)
                        ];
                    case 1:
                        return [
                            2 /*return*/ ,
                            _d.sent()
                        ];
                }
            });
        });
    };
    /**
     * Verifies connectivity of this driver by trying to open a connection with the provided driver options.
     *
     * @public
     * @param {Object} param - The object parameter
     * @param {string} param.database - The target database to verify connectivity for.
     * @returns {Promise<void>} promise resolved with void or rejected with error.
     */ Driver.prototype.verifyConnectivity = function(_a) {
        var _b = _a === void 0 ? {} : _a, _c = _b.database, database = _c === void 0 ? '' : _c;
        var connectionProvider = this._getOrCreateConnectionProvider();
        return new Promise(function(resolve, reject) {
            connectionProvider.verifyConnectivityAndGetServerInfo({
                database: database,
                accessMode: READ
            }).then(function() {
                return resolve();
            }).catch(function(e) {
                return reject(e);
            });
        });
    };
    /**
     * This method verifies the authorization credentials work by trying to acquire a connection
     * to one of the servers with the given credentials.
     *
     * @param {object} param - object parameter
     * @property {AuthToken} param.auth - the target auth for the to-be-acquired connection
     * @property {string} param.database - the target database for the to-be-acquired connection
     *
     * @returns {Promise<boolean>} promise resolved with true if succeed, false if failed with
     *  authentication issue and rejected with error if non-authentication error happens.
     */ Driver.prototype.verifyAuthentication = function() {
        return __awaiter(this, arguments, void 0, function(_a) {
            var connectionProvider;
            var _b = _a === void 0 ? {} : _a, database = _b.database, auth = _b.auth;
            return __generator(this, function(_c) {
                switch(_c.label){
                    case 0:
                        connectionProvider = this._getOrCreateConnectionProvider();
                        return [
                            4 /*yield*/ ,
                            connectionProvider.verifyAuthentication({
                                database: database !== null && database !== void 0 ? database : 'system',
                                auth: auth,
                                accessMode: READ
                            })
                        ];
                    case 1:
                        return [
                            2 /*return*/ ,
                            _c.sent()
                        ];
                }
            });
        });
    };
    /**
     * Get ServerInfo for the giver database.
     *
     * @param {Object} param - The object parameter
     * @param {string} param.database - The target database to verify connectivity for.
     * @returns {Promise<ServerInfo>} promise resolved with the ServerInfo or rejected with error.
     */ Driver.prototype.getServerInfo = function(_a) {
        var _b = _a === void 0 ? {} : _a, _c = _b.database, database = _c === void 0 ? '' : _c;
        var connectionProvider = this._getOrCreateConnectionProvider();
        return connectionProvider.verifyConnectivityAndGetServerInfo({
            database: database,
            accessMode: READ
        });
    };
    /**
     * Returns whether the server supports multi database capabilities based on the protocol
     * version negotiated via handshake.
     *
     * Note that this function call _always_ causes a round-trip to the server.
     *
     * @returns {Promise<boolean>} promise resolved with a boolean or rejected with error.
     */ Driver.prototype.supportsMultiDb = function() {
        var connectionProvider = this._getOrCreateConnectionProvider();
        return connectionProvider.supportsMultiDb();
    };
    /**
     * Returns whether the server supports transaction config capabilities based on the protocol
     * version negotiated via handshake.
     *
     * Note that this function call _always_ causes a round-trip to the server.
     *
     * @returns {Promise<boolean>} promise resolved with a boolean or rejected with error.
     */ Driver.prototype.supportsTransactionConfig = function() {
        var connectionProvider = this._getOrCreateConnectionProvider();
        return connectionProvider.supportsTransactionConfig();
    };
    /**
     * Returns whether the server supports user impersonation capabilities based on the protocol
     * version negotiated via handshake.
     *
     * Note that this function call _always_ causes a round-trip to the server.
     *
     * @returns {Promise<boolean>} promise resolved with a boolean or rejected with error.
     */ Driver.prototype.supportsUserImpersonation = function() {
        var connectionProvider = this._getOrCreateConnectionProvider();
        return connectionProvider.supportsUserImpersonation();
    };
    /**
     * Returns whether the driver session re-auth functionality capabilities based on the protocol
     * version negotiated via handshake.
     *
     * Note that this function call _always_ causes a round-trip to the server.
     *
     * @returns {Promise<boolean>} promise resolved with a boolean or rejected with error.
     */ Driver.prototype.supportsSessionAuth = function() {
        var connectionProvider = this._getOrCreateConnectionProvider();
        return connectionProvider.supportsSessionAuth();
    };
    /**
     * Returns the protocol version negotiated via handshake.
     *
     * Note that this function call _always_ causes a round-trip to the server.
     *
     * @returns {Promise<number>} the protocol version negotiated via handshake.
     * @throws {Error} When protocol negotiation fails
     */ Driver.prototype.getNegotiatedProtocolVersion = function() {
        var connectionProvider = this._getOrCreateConnectionProvider();
        return connectionProvider.getNegotiatedProtocolVersion();
    };
    /**
     * Returns boolean to indicate if driver has been configured with encryption enabled.
     *
     * @returns {boolean}
     */ Driver.prototype.isEncrypted = function() {
        return this._isEncrypted();
    };
    /**
     * @protected
     * @returns {boolean}
     */ Driver.prototype._supportsRouting = function() {
        return this._meta.routing;
    };
    /**
     * Returns boolean to indicate if driver has been configured with encryption enabled.
     *
     * @protected
     * @returns {boolean}
     */ Driver.prototype._isEncrypted = function() {
        return this._config.encrypted === util_1.ENCRYPTION_ON || this._config.encrypted === true;
    };
    /**
     * Returns the configured trust strategy that the driver has been configured with.
     *
     * @protected
     * @returns {TrustStrategy}
     */ Driver.prototype._getTrust = function() {
        return this._config.trust;
    };
    /**
     * Acquire a session to communicate with the database. The session will
     * borrow connections from the underlying connection pool as required and
     * should be considered lightweight and disposable.
     *
     * This comes with some responsibility - make sure you always call
     * {@link close} when you are done using a session, and likewise,
     * make sure you don't close your session before you are done using it. Once
     * it is closed, the underlying connection will be released to the connection
     * pool and made available for others to use.
     *
     * @public
     * @param {SessionConfig} param - The session configuration
     * @return {Session} new session.
     */ Driver.prototype.session = function(_a) {
        var _b = _a === void 0 ? {} : _a, _c = _b.defaultAccessMode, defaultAccessMode = _c === void 0 ? WRITE : _c, bookmarkOrBookmarks = _b.bookmarks, _d = _b.database, database = _d === void 0 ? '' : _d, impersonatedUser = _b.impersonatedUser, fetchSize = _b.fetchSize, bookmarkManager = _b.bookmarkManager, notificationFilter = _b.notificationFilter, auth = _b.auth;
        return this._newSession({
            defaultAccessMode: defaultAccessMode,
            bookmarkOrBookmarks: bookmarkOrBookmarks,
            database: database,
            reactive: false,
            impersonatedUser: impersonatedUser,
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            fetchSize: validateFetchSizeValue(fetchSize, this._config.fetchSize),
            bookmarkManager: bookmarkManager,
            notificationFilter: notificationFilter,
            auth: auth
        });
    };
    /**
     * Close all open sessions and other associated resources. You should
     * make sure to use this when you are done with this driver instance.
     *
     * This will interrupt any running connections.
     * Make sure you are done using the driver object and any resources
     * spawned from it (such as sessions or transactions) while calling
     * this method. Failing to do so will result in unspecified behavior.
     *
     * @public
     * @return {Promise<void>} promise resolved when the driver is closed.
     */ Driver.prototype.close = function() {
        this._log.info("Driver ".concat(this._id, " closing"));
        if (this._connectionProvider != null) {
            return this._connectionProvider.close();
        }
        return Promise.resolve();
    };
    // eslint-disable-next-line
    // @ts-ignore
    Driver.prototype[Symbol.asyncDispose] = function() {
        return this.close();
    };
    /**
     * @protected
     * @returns {void}
     */ Driver.prototype._afterConstruction = function() {
        this._log.info("".concat(this._meta.typename, " driver ").concat(this._id, " created for server address ").concat(this._meta.address.toString()));
    };
    Driver.prototype._homeDatabaseCallback = function(cacheKey, database) {
        this.homeDatabaseCache.set(cacheKey, database);
    };
    /**
     * @private
     */ Driver.prototype._newSession = function(_a) {
        var defaultAccessMode = _a.defaultAccessMode, bookmarkOrBookmarks = _a.bookmarkOrBookmarks, database = _a.database, reactive = _a.reactive, impersonatedUser = _a.impersonatedUser, fetchSize = _a.fetchSize, bookmarkManager = _a.bookmarkManager, notificationFilter = _a.notificationFilter, auth = _a.auth;
        var sessionMode = session_1.default._validateSessionMode(defaultAccessMode);
        var connectionProvider = this._getOrCreateConnectionProvider();
        // eslint-disable-next-line
        var cachedHomeDatabase = this.homeDatabaseCache.get((0, auth_util_1.cacheKey)(auth, impersonatedUser));
        var homeDatabaseCallback = this._homeDatabaseCallback.bind(this);
        var bookmarks = bookmarkOrBookmarks != null ? new bookmarks_1.Bookmarks(bookmarkOrBookmarks) : bookmarks_1.Bookmarks.empty();
        return this._createSession({
            mode: sessionMode,
            database: database !== null && database !== void 0 ? database : '',
            connectionProvider: connectionProvider,
            bookmarks: bookmarks,
            config: __assign({
                cachedHomeDatabase: cachedHomeDatabase,
                routingDriver: this._supportsRouting()
            }, this._config),
            reactive: reactive,
            impersonatedUser: impersonatedUser,
            fetchSize: fetchSize,
            bookmarkManager: bookmarkManager,
            notificationFilter: notificationFilter,
            auth: auth,
            log: this._log,
            homeDatabaseCallback: homeDatabaseCallback
        });
    };
    /**
     * @private
     */ Driver.prototype._getOrCreateConnectionProvider = function() {
        if (this._connectionProvider == null) {
            this._connectionProvider = this._createConnectionProvider(this._id, this._config, this._log, createHostNameResolver(this._config));
        }
        return this._connectionProvider;
    };
    return Driver;
}();
exports.Driver = Driver;
/**
 * @private
 * @returns {Object} the given config.
 */ function validateConfig(config, log) {
    var _a, _b;
    var resolver = config.resolver;
    if (resolver !== null && resolver !== undefined && typeof resolver !== 'function') {
        throw new TypeError("Configured resolver should be a function. Got: ".concat(typeof resolver));
    }
    if (config.connectionAcquisitionTimeout < config.connectionTimeout) {
        log.warn('Configuration for "connectionAcquisitionTimeout" should be greater than ' + 'or equal to "connectionTimeout". Otherwise, the connection acquisition ' + 'timeout will take precedence for over the connection timeout in scenarios ' + 'where a new connection is created while it is acquired');
    }
    if (((_a = config.notificationFilter) === null || _a === void 0 ? void 0 : _a.disabledCategories) != null && ((_b = config.notificationFilter) === null || _b === void 0 ? void 0 : _b.disabledClassifications) != null) {
        throw new Error('The notificationFilter can\'t have both "disabledCategories" and  "disabledClassifications" configured at the same time.');
    }
    return config;
}
/**
 * @private
 * @returns {void}
 */ function sanitizeConfig(config) {
    config.maxConnectionLifetime = sanitizeIntValue(config.maxConnectionLifetime, DEFAULT_MAX_CONNECTION_LIFETIME);
    config.maxConnectionPoolSize = sanitizeIntValue(config.maxConnectionPoolSize, constants_1.DEFAULT_POOL_MAX_SIZE);
    config.connectionAcquisitionTimeout = sanitizeIntValue(config.connectionAcquisitionTimeout, constants_1.DEFAULT_POOL_ACQUISITION_TIMEOUT);
    config.fetchSize = validateFetchSizeValue(config.fetchSize, DEFAULT_FETCH_SIZE);
    config.connectionTimeout = extractConnectionTimeout(config);
    config.connectionLivenessCheckTimeout = validateConnectionLivenessCheckTimeoutSizeValue(config.connectionLivenessCheckTimeout);
}
/**
 * @private
 * @returns {number}
 */ function sanitizeIntValue(rawValue, defaultWhenAbsent) {
    var sanitizedValue = parseInt(rawValue, 10);
    if (sanitizedValue > 0 || sanitizedValue === 0) {
        return sanitizedValue;
    } else if (sanitizedValue < 0) {
        return Number.MAX_SAFE_INTEGER;
    } else {
        return defaultWhenAbsent;
    }
}
/**
 * @private
 */ function validateFetchSizeValue(rawValue, defaultWhenAbsent) {
    var fetchSize = parseInt(rawValue, 10);
    if (fetchSize > 0 || fetchSize === constants_1.FETCH_ALL) {
        return fetchSize;
    } else if (fetchSize === 0 || fetchSize < 0) {
        throw new Error("The fetch size can only be a positive value or ".concat(constants_1.FETCH_ALL, " for ALL. However fetchSize = ").concat(fetchSize));
    } else {
        return defaultWhenAbsent;
    }
}
/**
 * @private
 */ function extractConnectionTimeout(config) {
    var configuredTimeout = parseInt(config.connectionTimeout, 10);
    if (configuredTimeout === 0) {
        // timeout explicitly configured to 0
        return null;
    } else if (!isNaN(configuredTimeout) && configuredTimeout < 0) {
        // timeout explicitly configured to a negative value
        return null;
    } else if (isNaN(configuredTimeout)) {
        // timeout not configured, use default value
        return constants_1.DEFAULT_CONNECTION_TIMEOUT_MILLIS;
    } else {
        // timeout configured, use the provided value
        return configuredTimeout;
    }
}
/**
 * @private
 */ function validateConnectionLivenessCheckTimeoutSizeValue(rawValue) {
    if (rawValue == null) {
        return undefined;
    }
    var connectionLivenessCheckTimeout = parseInt(rawValue, 10);
    if (connectionLivenessCheckTimeout < 0 || Number.isNaN(connectionLivenessCheckTimeout)) {
        throw new Error("The connectionLivenessCheckTimeout can only be a positive value or 0 for always. However connectionLivenessCheckTimeout = ".concat(connectionLivenessCheckTimeout));
    }
    return connectionLivenessCheckTimeout;
}
/**
 * @private
 * @returns {ConfiguredCustomResolver} new custom resolver that wraps the passed-in resolver function.
 *              If resolved function is not specified, it defaults to an identity resolver.
 */ function createHostNameResolver(config) {
    return new configured_custom_resolver_1.default(config.resolver);
}
exports.default = Driver;
}),
"[project]/frontend/node_modules/neo4j-driver-core/lib/auth.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/**
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [https://neo4j.com]
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ Object.defineProperty(exports, "__esModule", {
    value: true
});
var error_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/error.js [app-route] (ecmascript)");
var json_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/json.js [app-route] (ecmascript)");
/**
 * @property {function(username: string, password: string, realm: ?string)} basic the function to create a
 * basic authentication token.
 * @property {function(base64EncodedTicket: string)} kerberos the function to create a Kerberos authentication token.
 * Accepts a single string argument - base64 encoded Kerberos ticket.
 * @property {function(base64EncodedTicket: string)} bearer the function to create a Bearer authentication token.
 * Accepts a single string argument - base64 encoded Bearer ticket.
 * @property {function(principal: string, credentials: string, realm: string, scheme: string, parameters: ?object)} custom
 * the function to create a custom authentication token.
 */ var auth = {
    basic: function(username, password, realm) {
        if (realm != null) {
            return {
                scheme: 'basic',
                principal: username,
                credentials: password,
                realm: realm
            };
        } else {
            return {
                scheme: 'basic',
                principal: username,
                credentials: password
            };
        }
    },
    kerberos: function(base64EncodedTicket) {
        return {
            scheme: 'kerberos',
            principal: '',
            credentials: base64EncodedTicket
        };
    },
    bearer: function(base64EncodedToken) {
        return {
            scheme: 'bearer',
            credentials: base64EncodedToken
        };
    },
    none: function() {
        return {
            scheme: 'none'
        };
    },
    custom: function(principal, credentials, realm, scheme, parameters) {
        var output = {
            scheme: scheme,
            principal: principal
        };
        if (isNotEmpty(credentials)) {
            output.credentials = credentials;
        }
        if (isNotEmpty(realm)) {
            output.realm = realm;
        }
        if (isNotEmpty(parameters)) {
            try {
                (0, json_1.stringify)(parameters);
            } catch (e) {
                // eslint-disable-next-line
                // @ts-ignore
                throw (0, error_1.newError)('Circular references in custom auth token parameters', undefined, e);
            }
            output.parameters = parameters;
        }
        return output;
    }
};
function isNotEmpty(value) {
    return !(value === null || value === undefined || value === '' || Object.getPrototypeOf(value) === Object.prototype && Object.keys(value).length === 0);
}
exports.default = auth;
}),
"[project]/frontend/node_modules/neo4j-driver-core/lib/auth-token-manager.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/**
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [https://neo4j.com]
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ var __awaiter = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__awaiter || function(thisArg, _arguments, P, generator) {
    function adopt(value) {
        return value instanceof P ? value : new P(function(resolve) {
            resolve(value);
        });
    }
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
                step(generator["throw"](value));
            } catch (e) {
                reject(e);
            }
        }
        function step(result) {
            result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__generator || function(thisArg, body) {
    var _ = {
        label: 0,
        sent: function() {
            if (t[0] & 1) throw t[1];
            return t[1];
        },
        trys: [],
        ops: []
    }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() {
        return this;
    }), g;
    //TURBOPACK unreachable
    ;
    function verb(n) {
        return function(v) {
            return step([
                n,
                v
            ]);
        };
    }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while(g && (g = 0, op[0] && (_ = 0)), _)try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [
                op[0] & 2,
                t.value
            ];
            switch(op[0]){
                case 0:
                case 1:
                    t = op;
                    break;
                case 4:
                    _.label++;
                    return {
                        value: op[1],
                        done: false
                    };
                case 5:
                    _.label++;
                    y = op[1];
                    op = [
                        0
                    ];
                    continue;
                case 7:
                    op = _.ops.pop();
                    _.trys.pop();
                    continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                        _ = 0;
                        continue;
                    }
                    if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                        _.label = op[1];
                        break;
                    }
                    if (op[0] === 6 && _.label < t[1]) {
                        _.label = t[1];
                        t = op;
                        break;
                    }
                    if (t && _.label < t[2]) {
                        _.label = t[2];
                        _.ops.push(op);
                        break;
                    }
                    if (t[2]) _.ops.pop();
                    _.trys.pop();
                    continue;
            }
            op = body.call(thisArg, _);
        } catch (e) {
            op = [
                6,
                e
            ];
            y = 0;
        } finally{
            f = t = 0;
        }
        if (op[0] & 5) throw op[1];
        return {
            value: op[0] ? op[1] : void 0,
            done: true
        };
    }
};
var __importDefault = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : {
        "default": mod
    };
};
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.authTokenManagers = exports.AuthTokenAndExpiration = void 0;
exports.staticAuthTokenManager = staticAuthTokenManager;
var auth_1 = __importDefault(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/auth.js [app-route] (ecmascript)"));
var internal_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/internal/index.js [app-route] (ecmascript)");
/**
 * Interface for the piece of software responsible for keeping track of current active {@link AuthToken} across the driver.
 * @interface
 * @since 5.14
 */ var AuthTokenManager = function() {
    function AuthTokenManager() {}
    /**
     * Returns a valid token.
     *
     * **Warning**: This method must only ever return auth information belonging to the same identity.
     * Switching identities using the `AuthTokenManager` is undefined behavior.
     *
     * @returns {Promise<AuthToken>|AuthToken} The valid auth token or a promise for a valid auth token
     */ AuthTokenManager.prototype.getToken = function() {
        throw new Error('Not Implemented');
    };
    /**
     * Handles an error notification emitted by the server if a security error happened.
     *
     * @param {AuthToken} token The expired token.
     * @param {`Neo.ClientError.Security.${string}`} securityErrorCode the security error code returned by the server
     * @return {boolean} whether the exception was handled by the manager, so the driver knows if it can be retried..
     */ AuthTokenManager.prototype.handleSecurityException = function(token, securityErrorCode) {
        throw new Error('Not implemented');
    };
    return AuthTokenManager;
}();
exports.default = AuthTokenManager;
/**
 * Interface which defines an {@link AuthToken} with an expiration data time associated
 * @interface
 * @since 5.14
 */ var AuthTokenAndExpiration = function() {
    function AuthTokenAndExpiration() {
        /**
         * The {@link AuthToken} used for authenticate connections.
         *
         * @type {AuthToken}
         * @see {auth}
         */ this.token = auth_1.default.none();
        /**
         * The expected expiration date of the auth token.
         *
         * This information will be used for triggering the auth token refresh
         * in managers created with {@link authTokenManagers#bearer}.
         *
         * If this value is not defined, the {@link AuthToken} will be considered valid
         * until a `Neo.ClientError.Security.TokenExpired` error happens.
         *
         * @type {Date|undefined}
         */ this.expiration = undefined;
    }
    return AuthTokenAndExpiration;
}();
exports.AuthTokenAndExpiration = AuthTokenAndExpiration;
/**
 * Defines the object which holds the common {@link AuthTokenManager} used in the Driver
 */ var AuthTokenManagers = function() {
    function AuthTokenManagers() {}
    /**
     * Creates a {@link AuthTokenManager} for handle {@link AuthToken} which is expires.
     *
     * **Warning**: `tokenProvider` must only ever return auth information belonging to the same identity.
     * Switching identities using the `AuthTokenManager` is undefined behavior.
     *
     * @param {object} param0 - The params
     * @param {function(): Promise<AuthTokenAndExpiration>} param0.tokenProvider - Retrieves a new valid auth token.
     * Must only ever return auth information belonging to the same identity.
     * @returns {AuthTokenManager} The temporal auth data manager.
     */ AuthTokenManagers.prototype.bearer = function(_a) {
        var tokenProvider = _a.tokenProvider;
        if (typeof tokenProvider !== 'function') {
            throw new TypeError("tokenProvider should be function, but got: ".concat(typeof tokenProvider));
        }
        return new ExpirationBasedAuthTokenManager(tokenProvider, [
            'Neo.ClientError.Security.Unauthorized',
            'Neo.ClientError.Security.TokenExpired'
        ]);
    };
    /**
     * Creates a {@link AuthTokenManager} for handle {@link AuthToken} and password rotation.
     *
     * **Warning**: `tokenProvider` must only ever return auth information belonging to the same identity.
     * Switching identities using the `AuthTokenManager` is undefined behavior.
     *
     * @param {object} param0 - The params
     * @param {function(): Promise<AuthToken>} param0.tokenProvider - Retrieves a new valid auth token.
     * Must only ever return auth information belonging to the same identity.
     * @returns {AuthTokenManager} The basic auth data manager.
     */ AuthTokenManagers.prototype.basic = function(_a) {
        var _this = this;
        var tokenProvider = _a.tokenProvider;
        if (typeof tokenProvider !== 'function') {
            throw new TypeError("tokenProvider should be function, but got: ".concat(typeof tokenProvider));
        }
        return new ExpirationBasedAuthTokenManager(function() {
            return __awaiter(_this, void 0, void 0, function() {
                var _a;
                return __generator(this, function(_b) {
                    switch(_b.label){
                        case 0:
                            _a = {};
                            return [
                                4 /*yield*/ ,
                                tokenProvider()
                            ];
                        case 1:
                            return [
                                2 /*return*/ ,
                                (_a.token = _b.sent(), _a)
                            ];
                    }
                });
            });
        }, [
            'Neo.ClientError.Security.Unauthorized'
        ]);
    };
    return AuthTokenManagers;
}();
/**
 * Holds the common {@link AuthTokenManagers} used in the Driver.
 */ var authTokenManagers = new AuthTokenManagers();
exports.authTokenManagers = authTokenManagers;
Object.freeze(authTokenManagers);
/**
 * Create a {@link AuthTokenManager} for handle static {@link AuthToken}
 *
 * @private
 * @param {param} args - The args
 * @param {AuthToken} args.authToken - The static auth token which will always used in the driver.
 * @returns {AuthTokenManager} The temporal auth data manager.
 */ function staticAuthTokenManager(_a) {
    var authToken = _a.authToken;
    return new StaticAuthTokenManager(authToken);
}
var TokenRefreshObservable = function() {
    function TokenRefreshObservable(_subscribers) {
        if (_subscribers === void 0) {
            _subscribers = [];
        }
        this._subscribers = _subscribers;
    }
    TokenRefreshObservable.prototype.subscribe = function(sub) {
        this._subscribers.push(sub);
    };
    TokenRefreshObservable.prototype.onCompleted = function(data) {
        this._subscribers.forEach(function(sub) {
            return sub.onCompleted(data);
        });
    };
    TokenRefreshObservable.prototype.onError = function(error) {
        this._subscribers.forEach(function(sub) {
            return sub.onError(error);
        });
    };
    return TokenRefreshObservable;
}();
var ExpirationBasedAuthTokenManager = function() {
    function ExpirationBasedAuthTokenManager(_tokenProvider, _handledSecurityCodes, _currentAuthData, _refreshObservable) {
        this._tokenProvider = _tokenProvider;
        this._handledSecurityCodes = _handledSecurityCodes;
        this._currentAuthData = _currentAuthData;
        this._refreshObservable = _refreshObservable;
    }
    ExpirationBasedAuthTokenManager.prototype.getToken = function() {
        return __awaiter(this, void 0, void 0, function() {
            var _a;
            return __generator(this, function(_b) {
                switch(_b.label){
                    case 0:
                        if (!(this._currentAuthData === undefined || this._currentAuthData.expiration !== undefined && this._currentAuthData.expiration < new Date())) return [
                            3 /*break*/ ,
                            2
                        ];
                        return [
                            4 /*yield*/ ,
                            this._refreshAuthToken()
                        ];
                    case 1:
                        _b.sent();
                        _b.label = 2;
                    case 2:
                        return [
                            2 /*return*/ ,
                            (_a = this._currentAuthData) === null || _a === void 0 ? void 0 : _a.token
                        ];
                }
            });
        });
    };
    ExpirationBasedAuthTokenManager.prototype.handleSecurityException = function(token, securityErrorCode) {
        var _a;
        if (this._handledSecurityCodes.includes(securityErrorCode)) {
            if (internal_1.util.equals(token, (_a = this._currentAuthData) === null || _a === void 0 ? void 0 : _a.token)) {
                this._scheduleRefreshAuthToken();
            }
            return true;
        }
        return false;
    };
    ExpirationBasedAuthTokenManager.prototype._scheduleRefreshAuthToken = function(observer) {
        var _this = this;
        if (this._refreshObservable === undefined) {
            this._currentAuthData = undefined;
            this._refreshObservable = new TokenRefreshObservable();
            Promise.resolve(this._tokenProvider()).then(function(data) {
                var _a;
                _this._currentAuthData = data;
                (_a = _this._refreshObservable) === null || _a === void 0 ? void 0 : _a.onCompleted(data);
            }).catch(function(error) {
                var _a;
                (_a = _this._refreshObservable) === null || _a === void 0 ? void 0 : _a.onError(error);
            }).finally(function() {
                _this._refreshObservable = undefined;
            });
        }
        if (observer !== undefined) {
            this._refreshObservable.subscribe(observer);
        }
    };
    ExpirationBasedAuthTokenManager.prototype._refreshAuthToken = function() {
        return __awaiter(this, void 0, void 0, function() {
            var _this = this;
            return __generator(this, function(_a) {
                switch(_a.label){
                    case 0:
                        return [
                            4 /*yield*/ ,
                            new Promise(function(resolve, reject) {
                                _this._scheduleRefreshAuthToken({
                                    onCompleted: resolve,
                                    onError: reject
                                });
                            })
                        ];
                    case 1:
                        return [
                            2 /*return*/ ,
                            _a.sent()
                        ];
                }
            });
        });
    };
    return ExpirationBasedAuthTokenManager;
}();
var StaticAuthTokenManager = function() {
    function StaticAuthTokenManager(_authToken) {
        this._authToken = _authToken;
    }
    StaticAuthTokenManager.prototype.getToken = function() {
        return this._authToken;
    };
    StaticAuthTokenManager.prototype.handleSecurityException = function(_, __) {
        return false;
    };
    return StaticAuthTokenManager;
}();
}),
"[project]/frontend/node_modules/neo4j-driver-core/lib/types.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/**
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [https://neo4j.com]
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ var __extends = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__extends || function() {
    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || ({
            __proto__: []
        }) instanceof Array && function(d, b) {
            d.__proto__ = b;
        } || function(d, b) {
            for(var p in b)if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
        };
        return extendStatics(d, b);
    };
    return function(d, b) {
        if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
}();
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.InternalConfig = exports.Config = void 0;
/**
 * The Neo4j Driver configuration.
 *
 * @interface
 */ var Config = function() {
    /**
     * @constructor
     * @private
     */ function Config() {
        /**
         * Encryption level
         *
         * @type {'ENCRYPTION_ON'|'ENCRYPTION_OFF'|undefined}
         */ this.encrypted = undefined;
        /**
         * Trust strategy to use if encryption is enabled.
         *
         * There is no mode to disable trust other than disabling encryption altogether. The reason for
         * this is that if you don't know who you are talking to, it is easy for an
         * attacker to hijack your encrypted connection, rendering encryption pointless.
         *
         * TRUST_SYSTEM_CA_SIGNED_CERTIFICATES is the default choice. For NodeJS environments, this
         * means that you trust whatever certificates are in the default trusted certificate
         * store of the underlying system. For Browser environments, the trusted certificate
         * store is usually managed by the browser. Refer to your system or browser documentation
         * if you want to explicitly add a certificate as trusted.
         *
         * TRUST_CUSTOM_CA_SIGNED_CERTIFICATES is another option for trust verification -
         * whenever we establish an encrypted connection, we ensure the host is using
         * an encryption certificate that is in, or is signed by, a certificate given
         * as trusted through configuration. This option is only available for NodeJS environments.
         *
         * TRUST_ALL_CERTIFICATES means that you trust everything without any verifications
         * steps carried out.  This option is only available for NodeJS environments and should not
         * be used on production systems.
         *
         * @type {'TRUST_SYSTEM_CA_SIGNED_CERTIFICATES'|'TRUST_CUSTOM_CA_SIGNED_CERTIFICATES'|'TRUST_ALL_CERTIFICATES'|undefined}
         */ this.trust = undefined;
        /**
         * List of one or more paths to trusted encryption certificates.
         *
         * This only works in the NodeJS bundle,
         * and only matters if you use "TRUST_CUSTOM_CA_SIGNED_CERTIFICATES".
         *
         * The certificate files should be in regular X.509 PEM format.
         *
         * For instance, ['./trusted.pem']
         *
         * @type {?string[]}
         * @see {@link Config#trust}
         */ this.trustedCertificates = [];
        /**
         * The maximum total number of connections allowed to be managed by the connection pool, per host.
         *
         * This includes both in-use and idle connections.
         *
         * **Default**: ```100```
         *
         * @type {number|undefined}
         */ this.maxConnectionPoolSize = 100;
        /**
         * The maximum allowed lifetime for a pooled connection in milliseconds.
         *
         * Pooled connections older than this
         * threshold will be closed and removed from the pool. Such discarding happens during connection acquisition
         * so that new session is never backed by an old connection. Setting this option to a low value will cause
         * a high connection churn and might result in a performance hit. It is recommended to set maximum lifetime
         * to a slightly smaller value than the one configured in network equipment (load balancer, proxy, firewall,
         * etc. can also limit maximum connection lifetime). No maximum lifetime limit is imposed by default. Zero
         * and negative values result in lifetime not being checked.
         *
         * **Default**: ```60 * 60 * 1000``` (1 hour)
         *
         * @type {number|undefined}
         */ this.maxConnectionLifetime = 60 * 60 * 1000; // 1 hour
        /**
         * The maximum amount of time to wait to acquire a connection from the pool (to either create a new
         * connection or borrow an existing one).
         *
         * **Default**: ```60000``` (1 minute)
         *
         * @type {number|undefined}
         */ this.connectionAcquisitionTimeout = 60000; // 1 minute
        /**
         * Specify the maximum time in milliseconds transactions are allowed to retry via
         * {@link Session#executeRead}, {@link Session#executeWrite}, and {@link Driver#executeQuery} functions.
         *
         * These functions will retry the given unit of work on `ServiceUnavailable`, `SessionExpired` and transient
         * errors with exponential backoff using an initial delay of 1 second.
         *
         * **Default**: ```30000``` (30 seconds)
         *
         * @type {number|undefined}
         */ this.maxTransactionRetryTime = 30000; // 30 seconds
        /**
         * Specify the maximum time in milliseconds the connection can be idle without needing
         * to perform a liveness check on acquire from the pool.
         *
         * Pooled connections that have been idle in the pool for longer than this
         * timeout will be tested before they are used again, to ensure they are still live.
         * If this option is set too low, an additional network call will be incurred
         * when acquiring a connection, which causes a performance hit.
         *
         * If this is set high, you may receive sessions that are backed by no longer
         * live connections, which will lead to exceptions in your application.
         * Assuming the database is running, these exceptions will go away if you retry
         * acquiring sessions.
         *
         * Hence, this parameter tunes a balance between the likelihood of your application
         * seeing connection problems, and performance.
         *
         * You normally should not need to tune this parameter. No connection liveliness
         * check is done by default. Value 0 means connections will always be tested for
         * validity and negative values mean connections will never be tested.
         *
         * **Default**: ```undefined``` (Disabled)
         *
         * @type {number|undefined}
         */ this.connectionLivenessCheckTimeout = undefined; // Disabled
        /**
         * Specify socket connection timeout in milliseconds.
         *
         * Negative and zero values result in no timeout being applied.
         * Connection establishment will be then bound by the timeout configured
         * on the operating system level.
         *
         * **Default**: ```30000``` (30 seconds)
         *
         * @type {number|undefined}
         */ this.connectionTimeout = 30000; // 30 seconds
        /**
         * Make this driver always return native JavaScript numbers for integer values, instead of the
         * dedicated {@link Integer} class.
         *
         * Values that do not fit in native number bit range will be represented as `Number.NEGATIVE_INFINITY` or `Number.POSITIVE_INFINITY`.
         *
         * **Warning:** {@link ResultSummary} It is not always safe to enable this setting when JavaScript applications are not the only ones
         * interacting with the database. Stored numbers might in such case be not representable by native
         * `Number` type and thus the driver will return lossy values. This might also happen when data was
         * initially imported using neo4j import tool and contained numbers larger than
         * `Number.MAX_SAFE_INTEGER`. Driver will then return positive infinity, which is lossy.
         *
         * **Default**: ```false```
         *
         * Default value for this option is `false` because native JavaScript numbers might result
         * in loss of precision in the general case.
         *
         * @type {boolean|undefined}
         */ this.disableLosslessIntegers = false;
        /**
         * Make this driver always return native Javascript `BigInt` for integer values,
         * instead of the dedicated {@link Integer} class or `Number`.
         *
         * **Warning:** `BigInt` doesn't implement the method `toJSON`. To serialize it as `json`,
         * it's needed to add a custom implementation of the `toJSON` on the
         * `BigInt.prototype`. See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt#use_within_json.
         *
         * **Default**: ```false``` (for backwards compatibility)
         *
         * @type {boolean|undefined}
         */ this.useBigInt = false;
        /**
         * Specify the logging configuration for the driver. Object should have two properties `level` and `logger`.
         *
         * Property `level` represents the logging level which should be one of: 'error', 'warn', 'info' or 'debug'. This property is optional and
         * its default value is 'info'. Levels have priorities: 'error': 0, 'warn': 1, 'info': 2, 'debug': 3. Enabling a certain level also enables all
         * levels with lower priority. For example: 'error', 'warn' and 'info' will be logged when 'info' level is configured.
         *
         * Property `logger` represents the logging function which will be invoked for every log call with an acceptable level. The function should
         * take two string arguments `level` and `message`. The function should not execute any blocking or long-running operations
         * because it is often executed on a hot path.
         *
         * No logging is done by default. See `neo4j.logging` object that contains predefined logging implementations.
         *
         * @type {LoggingConfig|undefined}
         * @see {@link logging}
         */ this.logging = undefined;
        /**
         * Specify a custom server address resolver function used by the routing driver to resolve the initial address used to create the driver.
         *
         * Such resolution happens:
         *   * during the very first rediscovery when driver is created
         *   * when all the known routers from the current routing table have failed and driver needs to fallback to the initial address
         *
         *  In NodeJS environment driver defaults to performing a DNS resolution of the initial address using 'dns' module.
         *  In browser environment driver uses the initial address as-is.
         *  Value should be a function that takes a single string argument - the initial address. It should return an array of new addresses.
         *  Address is a string of shape '<host>:<port>'. Provided function can return either a Promise resolved with an array of addresses
         *  or array of addresses directly.
         *
         * @type {function(address: string) {} |undefined}
         */ this.resolver = undefined;
        /**
         * Configure filter for GqlStatusObject notifications returned in {@link ResultSummary#gqlStatusObjects}.
         *
         * See {@link SessionConfig#notificationFilter} for usage instructions.
         *
         * @type {NotificationFilter|undefined}
         */ this.notificationFilter = undefined;
        /**
         * Optionally override the default user agent name.
         *
         * **Default**: ```'neo4j-javascript/<version>'```
         *
         * @type {string|undefined}
         */ this.userAgent = undefined;
        /**
         * Specify if telemetry collection is disabled.
         *
         * By default, the driver will send anonymous usage statistics to the server it connects to if the server requests those.
         * By setting ``telemetryDisabled=true``, the driver will not send any telemetry data.
         *
         * The driver transmits the following information:
         *
         * Every time one of the following APIs is used to execute a query (for the first time), the server is informed of this
         * (without any further information like arguments, client identifiers, etc.):
         *
         * * {@link Driver#executeQuery}
         * * {@link Session#run}
         * * {@link Session#beginTransaction}
         * * {@link Session#executeRead}
         * * {@link Session#executeWrite}
         * * The reactive counterparts of methods above.
         *
         * Metrics are only collected when enabled both in server and driver instances.
         *
         * **Default**: ```false```
         *
         * @type {boolean}
         */ this.telemetryDisabled = false;
        /**
         * Client Certificate used for mutual TLS.
         *
         * A {@link ClientCertificateProvider} can be configure for scenarios
         * where the {@link ClientCertificate} might change over time.
         *
         * @type {ClientCertificate|ClientCertificateProvider|undefined}
         * @since 5.27
         */ this.clientCertificate = undefined;
    }
    return Config;
}();
exports.Config = Config;
var InternalConfig = function(_super) {
    __extends(InternalConfig, _super);
    function InternalConfig() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return InternalConfig;
}(Config);
exports.InternalConfig = InternalConfig;
}),
"[project]/frontend/node_modules/neo4j-driver-core/lib/client-certificate.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/**
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [https://neo4j.com]
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ var __extends = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__extends || function() {
    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf || ({
            __proto__: []
        }) instanceof Array && function(d, b) {
            d.__proto__ = b;
        } || function(d, b) {
            for(var p in b)if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
        };
        return extendStatics(d, b);
    };
    return function(d, b) {
        if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
}();
var __assign = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__assign || function() {
    __assign = Object.assign || function(t) {
        for(var s, i = 1, n = arguments.length; i < n; i++){
            s = arguments[i];
            for(var p in s)if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __createBinding = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__createBinding || (Object.create ? function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = {
            enumerable: true,
            get: function() {
                return m[k];
            }
        };
    }
    Object.defineProperty(o, k2, desc);
} : function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
});
var __setModuleDefault = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__setModuleDefault || (Object.create ? function(o, v) {
    Object.defineProperty(o, "default", {
        enumerable: true,
        value: v
    });
} : function(o, v) {
    o["default"] = v;
});
var __importStar = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__importStar || function() {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function(o) {
            var ar = [];
            for(var k in o)if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function(mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) {
            for(var k = ownKeys(mod), i = 0; i < k.length; i++)if (k[i] !== "default") __createBinding(result, mod, k[i]);
        }
        __setModuleDefault(result, mod);
        return result;
    };
}();
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.clientCertificateProviders = exports.RotatingClientCertificateProvider = exports.ClientCertificateProvider = void 0;
exports.resolveCertificateProvider = resolveCertificateProvider;
var json = __importStar(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/json.js [app-route] (ecmascript)"));
/**
 * Represents KeyFile represented as file.
 *
 * @typedef {object} KeyFileObject
 * @property {string} path - The path of the file
 * @property {string|undefined} password - the password of the key. If none,
 * the password defined at {@link ClientCertificate} will be used.
 */ /**
 * Holds the Client TLS certificate information.
 *
 * Browser instances of the driver should configure the certificate
 * in the system.
 *
 * Files defined in the {@link ClientCertificate#certfile}
 * and {@link ClientCertificate#keyfile} will read and loaded to
 * memory to fill the fields `cert` and `key` in security context.
 *
 * @interface
 * @see https://nodejs.org/api/tls.html#tlscreatesecurecontextoptions
 * @since 5.27
 */ var ClientCertificate = function() {
    function ClientCertificate() {
        /**
         * The path to client certificate file.
         *
         * @type {string|string[]}
         */ this.certfile = '';
        /**
         * The path to the key file.
         *
         * @type {string|string[]|KeyFileObject|KeyFileObject[]}
         */ this.keyfile = '';
        /**
         * The key's password.
         *
         * @type {string|undefined}
         */ this.password = undefined;
    }
    return ClientCertificate;
}();
exports.default = ClientCertificate;
/**
 * Provides a client certificate to the driver for mutual TLS.
 *
 * The driver will call {@link ClientCertificateProvider#hasUpdate} to check if the client wants to update the certificate.
 * If so, it will call {@link ClientCertificateProvider#getClientCertificate} to get the new certificate.
 *
 * The certificate is only used as a second factor for authentication authenticating the client.
 * The DMBS user still needs to authenticate with an authentication token.
 *
 * All implementations of this interface must be thread-safe and non-blocking for caller threads.
 * For instance, IO operations must not be done on the calling thread.
 *
 * Note that the work done in the methods of this interface count towards the connectionAcquisition.
 * Should fetching the certificate be particularly slow, it might be necessary to increase the timeout.
 *
 * @interface
 * @since 5.27
 */ var ClientCertificateProvider = function() {
    function ClientCertificateProvider() {}
    /**
     * Indicates whether the client wants the driver to update the certificate.
     *
     * @returns {Promise<boolean>|boolean} true if the client wants the driver to update the certificate
     */ ClientCertificateProvider.prototype.hasUpdate = function() {
        throw new Error('Not Implemented');
    };
    /**
     * Returns the certificate to use for new connections.
     *
     * Will be called by the driver after {@link ClientCertificateProvider#hasUpdate} returned true
     * or when the driver establishes the first connection.
     *
     * @returns {Promise<ClientCertificate>|ClientCertificate} the certificate to use for new connections
     */ ClientCertificateProvider.prototype.getClientCertificate = function() {
        throw new Error('Not Implemented');
    };
    return ClientCertificateProvider;
}();
exports.ClientCertificateProvider = ClientCertificateProvider;
/**
 * Interface for  {@link ClientCertificateProvider} which provides update certificate function.
 * @interface
 * @since 5.27
 */ var RotatingClientCertificateProvider = function(_super) {
    __extends(RotatingClientCertificateProvider, _super);
    function RotatingClientCertificateProvider() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /**
     * Updates the certificate stored in the provider.
     *
     * To be called by user-code when a new client certificate is available.
     *
     * @param {ClientCertificate} certificate - the new certificate
     * @throws {TypeError} If initialCertificate is not a ClientCertificate.
     */ RotatingClientCertificateProvider.prototype.updateCertificate = function(certificate) {
        throw new Error('Not implemented');
    };
    return RotatingClientCertificateProvider;
}(ClientCertificateProvider);
exports.RotatingClientCertificateProvider = RotatingClientCertificateProvider;
/**
 * Defines the object which holds the common {@link ClientCertificateProviders} used in the Driver
 *
 * @since 5.27
 */ var ClientCertificateProviders = function() {
    function ClientCertificateProviders() {}
    /**
     *
     * @param {object} param0 - The params
     * @param {ClientCertificate} param0.initialCertificate - The certificated used by the driver until {@link RotatingClientCertificateProvider#updateCertificate} get called.
     *
     * @returns {RotatingClientCertificateProvider} The rotating client certificate provider
     * @throws {TypeError} If initialCertificate is not a ClientCertificate.
     */ ClientCertificateProviders.prototype.rotating = function(_a) {
        var initialCertificate = _a.initialCertificate;
        if (initialCertificate == null || !isClientClientCertificate(initialCertificate)) {
            throw new TypeError("initialCertificate should be ClientCertificate, but got ".concat(json.stringify(initialCertificate)));
        }
        var certificate = __assign({}, initialCertificate);
        return new InternalRotatingClientCertificateProvider(certificate);
    };
    return ClientCertificateProviders;
}();
/**
 * Holds the common {@link ClientCertificateProviders} used in the Driver.
 *
 * @since 5.27
 */ var clientCertificateProviders = new ClientCertificateProviders();
exports.clientCertificateProviders = clientCertificateProviders;
Object.freeze(clientCertificateProviders);
/**
 * Resolves ClientCertificate or ClientCertificateProvider to a ClientCertificateProvider
 *
 * Method validates the input.
 *
 * @private
 * @param input
 * @returns {ClientCertificateProvider?} A client certificate provider if provided a ClientCertificate or a ClientCertificateProvider
 * @throws {TypeError} If input is not a ClientCertificate, ClientCertificateProvider, undefined or null.
 */ function resolveCertificateProvider(input) {
    if (input == null) {
        return undefined;
    }
    if (typeof input === 'object' && 'hasUpdate' in input && 'getClientCertificate' in input && typeof input.getClientCertificate === 'function' && typeof input.hasUpdate === 'function') {
        return input;
    }
    if (isClientClientCertificate(input)) {
        var certificate_1 = __assign({}, input);
        return {
            getClientCertificate: function() {
                return certificate_1;
            },
            hasUpdate: function() {
                return false;
            }
        };
    }
    throw new TypeError("clientCertificate should be configured with ClientCertificate or ClientCertificateProvider, but got ".concat(json.stringify(input)));
}
/**
 * Verify if object is a client certificate
 * @private
 * @param maybeClientCertificate - Maybe the certificate
 * @returns {boolean} if maybeClientCertificate is a client certificate object
 */ function isClientClientCertificate(maybeClientCertificate) {
    return maybeClientCertificate != null && typeof maybeClientCertificate === 'object' && 'certfile' in maybeClientCertificate && isCertFile(maybeClientCertificate.certfile) && 'keyfile' in maybeClientCertificate && isKeyFile(maybeClientCertificate.keyfile) && isStringOrNotPresent('password', maybeClientCertificate);
}
/**
 * Check value is a cert file
 * @private
 * @param {any} value the value
 * @returns {boolean} is a cert file
 */ function isCertFile(value) {
    return isString(value) || isArrayOf(value, isString);
}
/**
 * Check if the value is a keyfile.
 *
 * @private
 * @param {any} maybeKeyFile might be a keyfile value
 * @returns {boolean} the value is a KeyFile
 */ function isKeyFile(maybeKeyFile) {
    function check(obj) {
        return typeof obj === 'string' || obj != null && typeof obj === 'object' && 'path' in obj && typeof obj.path === 'string' && isStringOrNotPresent('password', obj);
    }
    return check(maybeKeyFile) || isArrayOf(maybeKeyFile, check);
}
/**
 * Verify if value is string
 *
 * @private
 * @param {any} value the value
 * @returns {boolean} is string
 */ function isString(value) {
    return typeof value === 'string';
}
/**
 * Verifies if value is a array of type
 *
 * @private
 * @param {any} value the value
 * @param {function} isType the type checker
 * @returns {boolean} value is array of type
 */ function isArrayOf(value, isType, allowEmpty) {
    if (allowEmpty === void 0) {
        allowEmpty = false;
    }
    return Array.isArray(value) && (allowEmpty || value.length > 0) && value.filter(isType).length === value.length;
}
/**
 * Verify if valueName is present in the object and is a string, or not present at all.
 *
 * @private
 * @param {string} valueName The value in the object
 * @param {object} obj The object
 * @returns {boolean} if the value is present in object as string or not present
 */ function isStringOrNotPresent(valueName, obj) {
    return !(valueName in obj) || obj[valueName] == null || typeof obj[valueName] === 'string';
}
/**
 * Internal implementation
 *
 * @private
 */ var InternalRotatingClientCertificateProvider = function() {
    function InternalRotatingClientCertificateProvider(_certificate, _updated) {
        if (_updated === void 0) {
            _updated = false;
        }
        this._certificate = _certificate;
        this._updated = _updated;
    }
    /**
     *
     * @returns {boolean|Promise<boolean>}
     */ InternalRotatingClientCertificateProvider.prototype.hasUpdate = function() {
        try {
            return this._updated;
        } finally{
            this._updated = false;
        }
    };
    /**
     *
     * @returns {ClientCertificate|Promise<ClientCertificate>}
     */ InternalRotatingClientCertificateProvider.prototype.getClientCertificate = function() {
        return this._certificate;
    };
    /**
     *
     * @param certificate
     * @returns {void}
     */ InternalRotatingClientCertificateProvider.prototype.updateCertificate = function(certificate) {
        if (!isClientClientCertificate(certificate)) {
            throw new TypeError("certificate should be ClientCertificate, but got ".concat(json.stringify(certificate)));
        }
        this._certificate = __assign({}, certificate);
        this._updated = true;
    };
    return InternalRotatingClientCertificateProvider;
}();
}),
"[project]/frontend/node_modules/neo4j-driver-core/lib/vector.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/**
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [https://neo4j.com]
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.vector = vector;
exports.isVector = isVector;
var error_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/error.js [app-route] (ecmascript)");
var VECTOR_IDENTIFIER_PROPERTY = '__isVector__';
/**
 * @typedef {'INT8' | 'INT16' | 'INT32' | 'INT64' | 'FLOAT32' | 'FLOAT64'} VectorType
 */ var vectorTypes = {
    INT8: 'INT8',
    INT16: 'INT16',
    INT32: 'INT32',
    INT64: 'INT64',
    FLOAT32: 'FLOAT32',
    FLOAT64: 'FLOAT64'
};
Object.freeze(vectorTypes);
/**
 * A wrapper class for JavaScript TypedArrays that makes the driver send them as a Vector type to the database.
 * @access public
 * @exports Vector
 * @class A Vector class that wraps a JavaScript TypedArray to enable writing/reading the Neo4j Vector type.
 * @param {Float32Array | Float64Array | Int8Array | Int16Array | Int32Array | BigInt64Array} typedArray The TypedArray to convert to a vector
 *
 * @constructor
 *
 */ var Vector = function() {
    function Vector(typedArray) {
        var _a, _b;
        if (typedArray instanceof Int8Array) {
            this._type = vectorTypes.INT8;
        } else if (typedArray instanceof Int16Array) {
            this._type = vectorTypes.INT16;
        } else if (typedArray instanceof Int32Array) {
            this._type = vectorTypes.INT32;
        } else if (typedArray instanceof BigInt64Array) {
            this._type = vectorTypes.INT64;
        } else if (typedArray instanceof Float32Array) {
            this._type = vectorTypes.FLOAT32;
        } else if (typedArray instanceof Float64Array) {
            this._type = vectorTypes.FLOAT64;
        } else {
            throw (0, error_1.newError)("Invalid argument type passed to Vector constructor: should be signed integer or float TypedArray, got: ".concat((_b = (_a = typedArray === null || typedArray === void 0 ? void 0 : typedArray.constructor) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : 'undefined or type without constructor name'));
        }
        this._typedArray = typedArray;
    }
    /**
     * Converts the Vector back to a typedArray
     * @returns {Float32Array | Float64Array | Int8Array | Int16Array | Int32Array | BigInt64Array} - a TypedArray of the Vectors type.
     */ Vector.prototype.asTypedArray = function() {
        return this._typedArray;
    };
    /**
     * Gets the type of the Vector
     * @returns {VectorType} - The type of the vector, corresponding to the type of the wrapped TypedArray.
     */ Vector.prototype.getType = function() {
        return this._type;
    };
    Vector.prototype.toString = function() {
        return "vector([".concat(this._typedArray.join(', '), "], ").concat(this._typedArray.length, ", ").concat(getTypeString(this._type), ")");
    };
    return Vector;
}();
exports.default = Vector;
function getTypeString(type) {
    switch(type){
        case 'INT8':
            return 'INTEGER8 NOT NULL';
        case 'INT16':
            return 'INTEGER16 NOT NULL';
        case 'INT32':
            return 'INTEGER32 NOT NULL';
        case 'INT64':
            return 'INTEGER NOT NULL';
        case 'FLOAT32':
            return 'FLOAT32 NOT NULL';
        case 'FLOAT64':
            return 'FLOAT NOT NULL';
        default:
            throw (0, error_1.newError)("Cannot stringify vector with unsupported type. Got type: ".concat(type));
    }
}
Object.defineProperty(Vector.prototype, VECTOR_IDENTIFIER_PROPERTY, {
    value: true,
    enumerable: false,
    configurable: false,
    writable: false
});
/**
 * Cast a TypedArray to a {@link Vector}
 * @access public
 * @param {Float32Array | Float64Array | Int8Array | Int16Array | Int32Array | BigInt64Array} typedArray - The value to use.
 * @return {Vector} - The Neo4j Vector ready to be used as a query parameter
 */ function vector(typedArray) {
    var _a, _b;
    try {
        return new Vector(typedArray);
    } catch (_c) {
        throw (0, error_1.newError)("Invalid argument type passed to vector constructor function: should be signed integer or float TypedArray, got: ".concat((_b = (_a = typedArray === null || typedArray === void 0 ? void 0 : typedArray.constructor) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : 'undefined or type without constructor name'));
    }
}
/**
 * Test if given object is an instance of the {@link Vector} class.
 * @param {Object} obj the object to test.
 * @return {boolean} `true` if given object is a {@link Vector}, `false` otherwise.
 */ function isVector(obj) {
    return obj != null && obj[VECTOR_IDENTIFIER_PROPERTY] === true;
}
}),
"[project]/frontend/node_modules/neo4j-driver-core/lib/mapping.rulesfactories.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/**
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [http://neo4j.com]
 *
 * This file is part of Neo4j.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ var __assign = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__assign || function() {
    __assign = Object.assign || function(t) {
        for(var s, i = 1, n = arguments.length; i < n; i++){
            s = arguments[i];
            for(var p in s)if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : {
        "default": mod
    };
};
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.rule = void 0;
var mapping_highlevel_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/mapping.highlevel.js [app-route] (ecmascript)");
var graph_types_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/graph-types.js [app-route] (ecmascript)");
var spatial_types_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/spatial-types.js [app-route] (ecmascript)");
var temporal_types_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/temporal-types.js [app-route] (ecmascript)");
var vector_1 = __importDefault(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/vector.js [app-route] (ecmascript)"));
/**
 * @property {function(rule: ?Rule)} asString Create a {@link Rule} that validates the value is a String.
 *
 * @property {function(rule: ?Rule & { acceptBigInt?: boolean })} asNumber Create a {@link Rule} that validates the value is a Number.
 *
 * @property {function(rule: ?Rule & { acceptNumber?: boolean })} AsBigInt Create a {@link Rule} that validates the value is a BigInt.
 *
 * @property {function(rule: ?Rule)} asNode Create a {@link Rule} that validates the value is a {@link Node}.
 *
 * @property {function(rule: ?Rule)} asRelationship Create a {@link Rule} that validates the value is a {@link Relationship}.
 *
 * @property {function(rule: ?Rule)} asPath Create a {@link Rule} that validates the value is a {@link Path}.
 *
 * @property {function(rule: ?Rule & { stringify?: boolean })} asDuration Create a {@link Rule} that validates the value is a {@link Duration}.
 *
 * @property {function(rule: ?Rule & { stringify?: boolean })} asLocalTime Create a {@link Rule} that validates the value is a {@link LocalTime}.
 *
 * @property {function(rule: ?Rule & { stringify?: boolean })} asLocalDateTime Create a {@link Rule} that validates the value is a {@link LocalDateTime}.
 *
 * @property {function(rule: ?Rule & { stringify?: boolean })} asTime Create a {@link Rule} that validates the value is a {@link Time}.
 *
 * @property {function(rule: ?Rule & { stringify?: boolean })} asDateTime Create a {@link Rule} that validates the value is a {@link DateTime}.
 *
 * @property {function(rule: ?Rule & { stringify?: boolean })} asDate Create a {@link Rule} that validates the value is a {@link Date}.
 *
 * @property {function(rule: ?Rule)} asPoint Create a {@link Rule} that validates the value is a {@link Point}.
 *
 * @property {function(rule: ?Rule & { apply?: Rule })} asList Create a {@link Rule} that validates the value is a List.
 *
 * @property {function(rule: ?Rule & { asTypedList: boolean })} asVector Create a {@link Rule} that validates the value is a List.
 *
 * @experimental Part of the Record Object Mapping preview feature
 */ exports.rule = Object.freeze({
    /**
     * Create a {@link Rule} that validates the value is a Boolean.
     *
     * @experimental Part of the Record Object Mapping preview feature
     * @param {Rule} rule Configurations for the rule
     * @returns {Rule} A new rule for the value
     */ asBoolean: function(rule) {
        return __assign({
            validate: function(value, field) {
                if (typeof value !== 'boolean') {
                    throw new TypeError("".concat(field, " should be a boolean but received ").concat(typeof value));
                }
            }
        }, rule);
    },
    /**
     * Create a {@link Rule} that validates the value is a String.
     *
     * @experimental Part of the Record Object Mapping preview feature
     * @param {Rule} rule Configurations for the rule
     * @returns {Rule} A new rule for the value
     */ asString: function(rule) {
        return __assign({
            validate: function(value, field) {
                if (typeof value !== 'string') {
                    throw new TypeError("".concat(field, " should be a string but received ").concat(typeof value));
                }
            }
        }, rule);
    },
    /**
     * Create a {@link Rule} that validates the value is a {@link Number}.
     *
     * @experimental Part of the Record Object Mapping preview feature
     * @param {Rule & { acceptBigInt?: boolean }} rule Configurations for the rule
     * @returns {Rule} A new rule for the value
     */ asNumber: function(rule) {
        return __assign({
            validate: function(value, field) {
                if (typeof value === 'object' && value.low !== undefined && value.high !== undefined && Object.keys(value).length === 2) {
                    throw new TypeError('Number returned as Object. To use asNumber mapping, set disableLosslessIntegers or useBigInt in driver config object');
                }
                if (typeof value !== 'number' && ((rule === null || rule === void 0 ? void 0 : rule.acceptBigInt) !== true || typeof value !== 'bigint')) {
                    throw new TypeError("".concat(field, " should be a number but received ").concat(typeof value));
                }
            },
            convert: function(value) {
                if (typeof value === 'bigint') {
                    return Number(value);
                }
                return value;
            }
        }, rule);
    },
    /**
     * Create a {@link Rule} that validates the value is a {@link BigInt}.
     *
     * @experimental Part of the Record Object Mapping preview feature
     * @param {Rule & { acceptNumber?: boolean }} rule Configurations for the rule
     * @returns {Rule} A new rule for the value
     */ asBigInt: function(rule) {
        return __assign({
            validate: function(value, field) {
                if (typeof value !== 'bigint' && ((rule === null || rule === void 0 ? void 0 : rule.acceptNumber) !== true || typeof value !== 'number')) {
                    throw new TypeError("".concat(field, " should be a bigint but received ").concat(typeof value));
                }
            },
            convert: function(value) {
                if (typeof value === 'number') {
                    return BigInt(value);
                }
                return value;
            }
        }, rule);
    },
    /**
     * Create a {@link Rule} that validates the value is a {@link Node}.
     *
     * @example
     * const actingJobsRules: Rules = {
     *  // Converts the person node to a Person object in accordance with provided rules
     *  person: neo4j.rule.asNode({
     *    convert: (node: Node) => node.as(Person, personRules)
     *  }),
     *  // Returns the movie node as a Node
     *  movie: neo4j.rule.asNode({}),
     * }
     *
     * @experimental Part of the Record Object Mapping preview feature
     * @param {Rule} rule Configurations for the rule
     * @returns {Rule} A new rule for the value
     */ asNode: function(rule) {
        return __assign({
            validate: function(value, field) {
                if (!(0, graph_types_1.isNode)(value)) {
                    throw new TypeError("".concat(field, " should be a Node but received ").concat(typeof value));
                }
            }
        }, rule);
    },
    /**
     * Create a {@link Rule} that validates the value is a {@link Relationship}.
     *
     * @experimental Part of the Record Object Mapping preview feature
     * @param {Rule} rule Configurations for the rule.
     * @returns {Rule} A new rule for the value
     */ asRelationship: function(rule) {
        return __assign({
            validate: function(value, field) {
                if (!(0, graph_types_1.isRelationship)(value)) {
                    throw new TypeError("".concat(field, " should be a Relationship but received ").concat(typeof value));
                }
            }
        }, rule);
    },
    /**
     * Create a {@link Rule} that validates the value is an {@link UnboundRelationship}
     *
     * @experimental Part of the Record Object Mapping preview feature
     * @param {Rule} rule Configurations for the rule
     * @returns {Rule} A new rule for the value
     */ asUnboundRelationship: function(rule) {
        return __assign({
            validate: function(value, field) {
                if (!(0, graph_types_1.isUnboundRelationship)(value)) {
                    throw new TypeError("".concat(field, " should be a UnboundRelationship but received ").concat(typeof value));
                }
            }
        }, rule);
    },
    /**
     * Create a {@link Rule} that validates the value is a {@link Path}
     *
     * @experimental Part of the Record Object Mapping preview feature
     * @param {Rule} rule Configurations for the rule
     * @returns {Rule} A new rule for the value
     */ asPath: function(rule) {
        return __assign({
            validate: function(value, field) {
                if (!(0, graph_types_1.isPath)(value)) {
                    throw new TypeError("".concat(field, " should be a Path but received ").concat(typeof value));
                }
            }
        }, rule);
    },
    /**
     * Create a {@link Rule} that validates the value is a {@link Point}
     *
     * @experimental Part of the Record Object Mapping preview feature
     * @param {Rule} rule Configurations for the rule
     * @returns {Rule} A new rule for the value
     */ asPoint: function(rule) {
        return __assign({
            validate: function(value, field) {
                if (!(0, spatial_types_1.isPoint)(value)) {
                    throw new TypeError("".concat(field, " should be a Point but received ").concat(typeof value));
                }
            }
        }, rule);
    },
    /**
     * Create a {@link Rule} that validates the value is a {@link Duration}
     *
     * @experimental Part of the Record Object Mapping preview feature
     * @param {Rule} rule Configurations for the rule
     * @returns {Rule} A new rule for the value
     */ asDuration: function(rule) {
        return __assign({
            validate: function(value, field) {
                if (!(0, temporal_types_1.isDuration)(value)) {
                    throw new TypeError("".concat(field, " should be a Duration but received ").concat(typeof value));
                }
            },
            convert: function(value) {
                return (rule === null || rule === void 0 ? void 0 : rule.stringify) === true ? value.toString() : value;
            }
        }, rule);
    },
    /**
     * Create a {@link Rule} that validates the value is a {@link LocalTime}
     *
     * @experimental Part of the Record Object Mapping preview feature
     * @param {Rule} rule Configurations for the rule
     * @returns {Rule} A new rule for the value
     */ asLocalTime: function(rule) {
        return __assign({
            validate: function(value, field) {
                if (!(0, temporal_types_1.isLocalTime)(value)) {
                    throw new TypeError("".concat(field, " should be a LocalTime but received ").concat(typeof value));
                }
            },
            convert: function(value) {
                return (rule === null || rule === void 0 ? void 0 : rule.stringify) === true ? value.toString() : value;
            }
        }, rule);
    },
    /**
     * Create a {@link Rule} that validates the value is a {@link Time}
     *
     * @experimental Part of the Record Object Mapping preview feature
     * @param {Rule} rule Configurations for the rule
     * @returns {Rule} A new rule for the value
     */ asTime: function(rule) {
        return __assign({
            validate: function(value, field) {
                if (!(0, temporal_types_1.isTime)(value)) {
                    throw new TypeError("".concat(field, " should be a Time but received ").concat(typeof value));
                }
            },
            convert: function(value) {
                return (rule === null || rule === void 0 ? void 0 : rule.stringify) === true ? value.toString() : value;
            }
        }, rule);
    },
    /**
     * Create a {@link Rule} that validates the value is a {@link Date}
     *
     * @experimental Part of the Record Object Mapping preview feature
     * @param {Rule} rule Configurations for the rule
     * @returns {Rule} A new rule for the value
     */ asDate: function(rule) {
        return __assign({
            validate: function(value, field) {
                if (!(0, temporal_types_1.isDate)(value)) {
                    throw new TypeError("".concat(field, " should be a Date but received ").concat(typeof value));
                }
            },
            convert: function(value) {
                return convertStdDate(value, rule);
            }
        }, rule);
    },
    /**
     * Create a {@link Rule} that validates the value is a {@link LocalDateTime}
     *
     * @experimental Part of the Record Object Mapping preview feature
     * @param {Rule} rule Configurations for the rule
     * @returns {Rule} A new rule for the value
     */ asLocalDateTime: function(rule) {
        return __assign({
            validate: function(value, field) {
                if (!(0, temporal_types_1.isLocalDateTime)(value)) {
                    throw new TypeError("".concat(field, " should be a LocalDateTime but received ").concat(typeof value));
                }
            },
            convert: function(value) {
                return convertStdDate(value, rule);
            }
        }, rule);
    },
    /**
     * Create a {@link Rule} that validates the value is a {@link DateTime}
     *
     * @experimental Part of the Record Object Mapping preview feature
     * @param {Rule} rule Configurations for the rule
     * @returns {Rule} A new rule for the value
     */ asDateTime: function(rule) {
        return __assign({
            validate: function(value, field) {
                if (!(0, temporal_types_1.isDateTime)(value)) {
                    throw new TypeError("".concat(field, " should be a DateTime but received ").concat(typeof value));
                }
            },
            convert: function(value) {
                return convertStdDate(value, rule);
            }
        }, rule);
    },
    /**
     * Create a {@link Rule} that validates the value is a List. Optionally taking a rule for hydrating the contained values.
     *
     * @experimental Part of the Record Object Mapping preview feature
     * @param {Rule & { apply?: Rule }} rule Configurations for the rule
     * @returns {Rule} A new rule for the value
     */ asList: function(rule) {
        return __assign({
            validate: function(value, field) {
                if (!Array.isArray(value)) {
                    throw new TypeError("".concat(field, " should be a list but received ").concat(typeof value));
                }
            },
            convert: function(list, field) {
                if ((rule === null || rule === void 0 ? void 0 : rule.apply) != null) {
                    return list.map(function(value, index) {
                        return (0, mapping_highlevel_1.valueAs)(value, "".concat(field, "[").concat(index, "]"), rule.apply);
                    });
                }
                return list;
            }
        }, rule);
    },
    /**
     * Create a {@link Rule} that validates the value is a Vector.
     *
     * @experimental Part of the Record Object Mapping preview feature
     * @param {Rule & { asTypedList?: boolean }} rule Configurations for the rule
     * @returns {Rule} A new rule for the value
     */ asVector: function(rule) {
        return __assign({
            validate: function(value, field) {
                if (!(value instanceof vector_1.default)) {
                    throw new TypeError("".concat(field, " should be a vector but received ").concat(typeof value));
                }
            },
            convert: function(value) {
                if ((rule === null || rule === void 0 ? void 0 : rule.asTypedList) === true) {
                    return value._typedArray;
                }
                return value;
            }
        }, rule);
    }
});
function convertStdDate(value, rule) {
    if (rule != null) {
        if (rule.stringify === true) {
            return value.toString();
        } else if (rule.toStandardDate === true) {
            return value.toStandardDate();
        }
    }
    return value;
}
}),
"[project]/frontend/node_modules/neo4j-driver-core/lib/mapping.decorators.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __assign = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__assign || function() {
    __assign = Object.assign || function(t) {
        for(var s, i = 1, n = arguments.length; i < n; i++){
            s = arguments[i];
            for(var p in s)if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", {
    value: true
});
var mapping_highlevel_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/mapping.highlevel.js [app-route] (ecmascript)");
var mapping_rulesfactories_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/mapping.rulesfactories.js [app-route] (ecmascript)");
/**
 * Class Decorator Factory that enables the Neo4j Driver to map result records to this class
 *
 * @returns {Function} Class Decorator
 * @experimental Part of the Record Object Mapping preview feature
 */ function mappedClass() {
    return function(_, context) {
        mapping_highlevel_1.rulesRegistry[context.name] = context.metadata;
    };
}
/**
 * Property Decorator Factory that enables the Neo4j Driver to map this property to a boolean.
 *
 * @param {Rule} config
 * @returns {Function} Property Decorator
 * @experimental Part of the Record Object Mapping preview feature
 */ function booleanProperty(config) {
    return function(_, context) {
        context.metadata[context.name] = mapping_rulesfactories_1.rule.asBoolean(config);
    };
}
/**
 * Property Decorator Factory that enables the Neo4j Driver to map this property to a string.
 *
 * @param {Rule} config
 * @returns {Function} Property Decorator
 * @experimental Part of the Record Object Mapping preview feature
 */ function stringProperty(config) {
    return function(_, context) {
        context.metadata[context.name] = mapping_rulesfactories_1.rule.asString(config);
    };
}
/**
 * Property Decorator Factory that enables the Neo4j Driver to map this property to a number.
 *
 * @param {Rule & { acceptBigInt?: boolean }} config
 * @returns {Function} Property Decorator
 * @experimental Part of the Record Object Mapping preview feature
 */ function numberProperty(config) {
    return function(_, context) {
        context.metadata[context.name] = mapping_rulesfactories_1.rule.asNumber(config);
    };
}
/**
 * Property Decorator Factory that enables the Neo4j Driver to map this property to a BigInt.
 *
 * @param {Rule & { acceptNumber?: boolean }} config
 * @returns {Function} Property Decorator
 * @experimental Part of the Record Object Mapping preview feature
 */ function bigIntProperty(config) {
    return function(_, context) {
        context.metadata[context.name] = mapping_rulesfactories_1.rule.asBigInt(config);
    };
}
/**
 * Property Decorator Factory that enables the Neo4j Driver to map this property to a Node.
 *
 * @param {Rule} config
 * @returns {Function} Property Decorator
 * @experimental Part of the Record Object Mapping preview feature
 */ function nodeProperty(config) {
    return function(_, context) {
        context.metadata[context.name] = mapping_rulesfactories_1.rule.asNode(config);
    };
}
/**
 * Property Decorator Factory that enables the Neo4j Driver to map this property to a Relationship.
 *
 * @param {Rule} config
 * @returns {Function} Property Decorator
 * @experimental Part of the Record Object Mapping preview feature
 */ function relationshipProperty(config) {
    return function(_, context) {
        context.metadata[context.name] = mapping_rulesfactories_1.rule.asRelationship(config);
    };
}
/**
 * Property Decorator Factory that enables the Neo4j Driver to map this property to a Path.
 *
 * @param {Rule} config
 * @returns {Function} Property Decorator
 * @experimental Part of the Record Object Mapping preview feature
 */ function pathProperty(config) {
    return function(_, context) {
        context.metadata[context.name] = mapping_rulesfactories_1.rule.asPath(config);
    };
}
/**
 * Property Decorator Factory that enables the Neo4j Driver to map this property to a Point.
 *
 * @param {Rule} config
 * @returns {Function} Property Decorator
 * @experimental Part of the Record Object Mapping preview feature
 */ function pointProperty(config) {
    return function(_, context) {
        context.metadata[context.name] = mapping_rulesfactories_1.rule.asPoint(config);
    };
}
/**
 * Property Decorator Factory that enables the Neo4j Driver to map this property to a Duration.
 *
 * @param {Rule} config
 * @returns {Function} Property Decorator
 * @experimental Part of the Record Object Mapping preview feature
 */ function durationProperty(config) {
    return function(_, context) {
        context.metadata[context.name] = mapping_rulesfactories_1.rule.asDuration(config);
    };
}
/**
 * Property Decorator Factory that enables the Neo4j Driver to map this property to a List
 *
 * @param {Rule & { apply?: Rule }} config
 * @returns {Function} Property Decorator
 * @experimental Part of the Record Object Mapping preview feature
 */ function listProperty(config) {
    return function(_, context) {
        context.metadata[context.name] = mapping_rulesfactories_1.rule.asList(__assign({
            apply: __assign({}, context.metadata[context.name])
        }, config));
    };
}
/**
 * Property Decorator Factory that enables the Neo4j Driver to map this property to a Vector
 *
 * @param {Rule & { asTypedList?: boolean }} config
 * @returns {Function} Property Decorator
 * @experimental Part of the Record Object Mapping preview feature
 */ function vectorProperty(config) {
    return function(_, context) {
        context.metadata[context.name] = mapping_rulesfactories_1.rule.asVector(config);
    };
}
/**
 * Property Decorator Factory that sets this property to optional.
 * NOTE: Should be put above a type decorator.
 *
 * @param {Rule} config
 * @returns {Function} Property Decorator
 * @experimental Part of the Record Object Mapping preview feature
 */ function optionalProperty() {
    return function(_, context) {
        context.metadata[context.name] = __assign({
            optional: true
        }, context.metadata[context.name]);
    };
}
/**
 * Property Decorator Factory that sets a custom parameter name to map this property to.
 * NOTE: Should be put above a type decorator.
 *
 * @param {Rule} config
 * @returns {Function} Property Decorator
 * @experimental Part of the Record Object Mapping preview feature
 */ function mapPropertyFromName(name) {
    return function(_, context) {
        context.metadata[context.name] = __assign({
            from: name
        }, context.metadata[context.name]);
    };
}
/**
 * Property Decorator Factory that sets the Neo4j Driver to convert this property to another type.
 * NOTE: Should be put above a type decorator of type Node or Relationship.
 *
 * @param {Rule} config
 * @returns {Function} Property Decorator
 * @experimental Part of the Record Object Mapping preview feature
 */ function convertPropertyToType(type) {
    return function(_, context) {
        context.metadata[context.name] = __assign({
            convert: function(node) {
                return node.as(type);
            }
        }, context.metadata[context.name]);
    };
}
var forExport = {
    booleanProperty: booleanProperty,
    stringProperty: stringProperty,
    numberProperty: numberProperty,
    bigIntProperty: bigIntProperty,
    nodeProperty: nodeProperty,
    relationshipProperty: relationshipProperty,
    pathProperty: pathProperty,
    pointProperty: pointProperty,
    durationProperty: durationProperty,
    listProperty: listProperty,
    vectorProperty: vectorProperty,
    optionalProperty: optionalProperty,
    mapPropertyFromName: mapPropertyFromName,
    convertPropertyToType: convertPropertyToType,
    mappedClass: mappedClass
};
exports.default = forExport;
}),
"[project]/frontend/node_modules/neo4j-driver-core/lib/unsupported-type.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/**
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [https://neo4j.com]
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.isUnsupportedType = isUnsupportedType;
var UNSUPPORTED_TYPE_IDENTIFIER_PROPERTY = '__isUnsupportedType__';
/**
 * Represents a type unknown to the driver, received from the server.
 * This type is used for instance when a newer DBMS produces a result containing a type that the current version of the driver does not yet understand.
 *
 * Note that this type may only be received from the server, but cannot be sent to the server (e.g., as a query parameter).
 *
 * The attributes exposed by this type are meant for displaying and debugging purposes.
 * They may change in future versions of the server, and should not be relied upon for any logic in your application.
 * If your application requires handling this type, you must upgrade your driver to a version that supports it.
 * @access public
 * @exports UnsupportedType
 */ var UnsupportedType = function() {
    function UnsupportedType(name, minimumProtocolMajor, minimumProtocolMinor, message) {
        /**
         * The name of the type that could not be transmitted.
         *
         * @type {string}
         */ this.name = name;
        /**
         * The minimum required Bolt protocol version that supports this type.
         * Note: Bolt versions are not generally equivalent to driver versions. See {@link https://neo4j.com/docs/javascript-manual/current/data-types/} for which driver version is required for new Types.
         *
         * @type {string}
         */ this.minimumProtocolVersion = "".concat(minimumProtocolMajor, ".").concat(minimumProtocolMinor);
        /**
         * An optional message, including additional information regarding the untransmittable value.
         *
         * @type {string | undefined}
         */ this.message = message;
    }
    UnsupportedType.prototype.toString = function() {
        return "UnsupportedType<".concat(this.name, ">");
    };
    return UnsupportedType;
}();
exports.default = UnsupportedType;
Object.defineProperty(UnsupportedType.prototype, UNSUPPORTED_TYPE_IDENTIFIER_PROPERTY, {
    value: true,
    enumerable: false,
    configurable: false,
    writable: false
});
/**
 * Test if given object is an instance of the {@link UnsupportedType} class.
 * @param {Object} obj the object to test.
 * @return {boolean} `true` if given object is an {@link UnsupportedType}, `false` otherwise.
 */ function isUnsupportedType(obj) {
    return obj != null && obj[UNSUPPORTED_TYPE_IDENTIFIER_PROPERTY] === true;
}
}),
"[project]/frontend/node_modules/neo4j-driver-core/lib/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

/**
 * Copyright (c) "Neo4j"
 * Neo4j Sweden AB [https://neo4j.com]
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */ var __createBinding = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__createBinding || (Object.create ? function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
        desc = {
            enumerable: true,
            get: function() {
                return m[k];
            }
        };
    }
    Object.defineProperty(o, k2, desc);
} : function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
});
var __setModuleDefault = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__setModuleDefault || (Object.create ? function(o, v) {
    Object.defineProperty(o, "default", {
        enumerable: true,
        value: v
    });
} : function(o, v) {
    o["default"] = v;
});
var __importStar = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__importStar || function() {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function(o) {
            var ar = [];
            for(var k in o)if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function(mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) {
            for(var k = ownKeys(mod), i = 0; i < k.length; i++)if (k[i] !== "default") __createBinding(result, mod, k[i]);
        }
        __setModuleDefault(result, mod);
        return result;
    };
}();
var __importDefault = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : {
        "default": mod
    };
};
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Result = exports.Stats = exports.QueryStatistics = exports.ProfiledPlan = exports.Plan = exports.GqlStatusObject = exports.Notification = exports.ServerInfo = exports.queryType = exports.ResultSummary = exports.Record = exports.isPathSegment = exports.PathSegment = exports.isPath = exports.Path = exports.isUnboundRelationship = exports.UnboundRelationship = exports.isRelationship = exports.Relationship = exports.isNode = exports.Node = exports.Time = exports.LocalTime = exports.LocalDateTime = exports.isTime = exports.isLocalTime = exports.isLocalDateTime = exports.isDuration = exports.isDateTime = exports.isDate = exports.Duration = exports.DateTime = exports.Date = exports.Point = exports.isPoint = exports.internal = exports.toString = exports.toNumber = exports.inSafeRange = exports.isInt = exports.int = exports.Integer = exports.error = exports.isRetriableError = exports.isRetryableError = exports.GQLError = exports.newGQLError = exports.Neo4jError = exports.newError = exports.authTokenManagers = void 0;
exports.isUnsupportedType = exports.UnsupportedType = exports.StandardCase = exports.RecordObjectMapping = exports.mappingDecorators = exports.rule = exports.ProtocolVersion = exports.vector = exports.Vector = exports.isVector = exports.resolveCertificateProvider = exports.clientCertificateProviders = exports.notificationFilterMinimumSeverityLevel = exports.notificationFilterDisabledClassification = exports.notificationFilterDisabledCategory = exports.notificationSeverityLevel = exports.notificationClassification = exports.notificationCategory = exports.resultTransformers = exports.routing = exports.staticAuthTokenManager = exports.bookmarkManager = exports.auth = exports.json = exports.driver = exports.types = exports.Driver = exports.Session = exports.TransactionPromise = exports.ManagedTransaction = exports.Transaction = exports.Connection = exports.Releasable = exports.ConnectionProvider = exports.EagerResult = void 0;
var error_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/error.js [app-route] (ecmascript)");
Object.defineProperty(exports, "newError", {
    enumerable: true,
    get: function() {
        return error_1.newError;
    }
});
Object.defineProperty(exports, "Neo4jError", {
    enumerable: true,
    get: function() {
        return error_1.Neo4jError;
    }
});
Object.defineProperty(exports, "newGQLError", {
    enumerable: true,
    get: function() {
        return error_1.newGQLError;
    }
});
Object.defineProperty(exports, "GQLError", {
    enumerable: true,
    get: function() {
        return error_1.GQLError;
    }
});
Object.defineProperty(exports, "isRetryableError", {
    enumerable: true,
    get: function() {
        return error_1.isRetryableError;
    }
});
Object.defineProperty(exports, "isRetriableError", {
    enumerable: true,
    get: function() {
        return error_1.isRetriableError;
    }
});
var integer_1 = __importStar(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/integer.js [app-route] (ecmascript)"));
exports.Integer = integer_1.default;
Object.defineProperty(exports, "int", {
    enumerable: true,
    get: function() {
        return integer_1.int;
    }
});
Object.defineProperty(exports, "isInt", {
    enumerable: true,
    get: function() {
        return integer_1.isInt;
    }
});
Object.defineProperty(exports, "inSafeRange", {
    enumerable: true,
    get: function() {
        return integer_1.inSafeRange;
    }
});
Object.defineProperty(exports, "toNumber", {
    enumerable: true,
    get: function() {
        return integer_1.toNumber;
    }
});
Object.defineProperty(exports, "toString", {
    enumerable: true,
    get: function() {
        return integer_1.toString;
    }
});
var temporal_types_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/temporal-types.js [app-route] (ecmascript)");
Object.defineProperty(exports, "Date", {
    enumerable: true,
    get: function() {
        return temporal_types_1.Date;
    }
});
Object.defineProperty(exports, "DateTime", {
    enumerable: true,
    get: function() {
        return temporal_types_1.DateTime;
    }
});
Object.defineProperty(exports, "Duration", {
    enumerable: true,
    get: function() {
        return temporal_types_1.Duration;
    }
});
Object.defineProperty(exports, "isDate", {
    enumerable: true,
    get: function() {
        return temporal_types_1.isDate;
    }
});
Object.defineProperty(exports, "isDateTime", {
    enumerable: true,
    get: function() {
        return temporal_types_1.isDateTime;
    }
});
Object.defineProperty(exports, "isDuration", {
    enumerable: true,
    get: function() {
        return temporal_types_1.isDuration;
    }
});
Object.defineProperty(exports, "isLocalDateTime", {
    enumerable: true,
    get: function() {
        return temporal_types_1.isLocalDateTime;
    }
});
Object.defineProperty(exports, "isLocalTime", {
    enumerable: true,
    get: function() {
        return temporal_types_1.isLocalTime;
    }
});
Object.defineProperty(exports, "isTime", {
    enumerable: true,
    get: function() {
        return temporal_types_1.isTime;
    }
});
Object.defineProperty(exports, "LocalDateTime", {
    enumerable: true,
    get: function() {
        return temporal_types_1.LocalDateTime;
    }
});
Object.defineProperty(exports, "LocalTime", {
    enumerable: true,
    get: function() {
        return temporal_types_1.LocalTime;
    }
});
Object.defineProperty(exports, "Time", {
    enumerable: true,
    get: function() {
        return temporal_types_1.Time;
    }
});
var graph_types_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/graph-types.js [app-route] (ecmascript)");
Object.defineProperty(exports, "Node", {
    enumerable: true,
    get: function() {
        return graph_types_1.Node;
    }
});
Object.defineProperty(exports, "isNode", {
    enumerable: true,
    get: function() {
        return graph_types_1.isNode;
    }
});
Object.defineProperty(exports, "Relationship", {
    enumerable: true,
    get: function() {
        return graph_types_1.Relationship;
    }
});
Object.defineProperty(exports, "isRelationship", {
    enumerable: true,
    get: function() {
        return graph_types_1.isRelationship;
    }
});
Object.defineProperty(exports, "UnboundRelationship", {
    enumerable: true,
    get: function() {
        return graph_types_1.UnboundRelationship;
    }
});
Object.defineProperty(exports, "isUnboundRelationship", {
    enumerable: true,
    get: function() {
        return graph_types_1.isUnboundRelationship;
    }
});
Object.defineProperty(exports, "Path", {
    enumerable: true,
    get: function() {
        return graph_types_1.Path;
    }
});
Object.defineProperty(exports, "isPath", {
    enumerable: true,
    get: function() {
        return graph_types_1.isPath;
    }
});
Object.defineProperty(exports, "PathSegment", {
    enumerable: true,
    get: function() {
        return graph_types_1.PathSegment;
    }
});
Object.defineProperty(exports, "isPathSegment", {
    enumerable: true,
    get: function() {
        return graph_types_1.isPathSegment;
    }
});
var record_1 = __importDefault(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/record.js [app-route] (ecmascript)"));
exports.Record = record_1.default;
var spatial_types_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/spatial-types.js [app-route] (ecmascript)");
Object.defineProperty(exports, "isPoint", {
    enumerable: true,
    get: function() {
        return spatial_types_1.isPoint;
    }
});
Object.defineProperty(exports, "Point", {
    enumerable: true,
    get: function() {
        return spatial_types_1.Point;
    }
});
var result_summary_1 = __importStar(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/result-summary.js [app-route] (ecmascript)"));
exports.ResultSummary = result_summary_1.default;
Object.defineProperty(exports, "queryType", {
    enumerable: true,
    get: function() {
        return result_summary_1.queryType;
    }
});
Object.defineProperty(exports, "ServerInfo", {
    enumerable: true,
    get: function() {
        return result_summary_1.ServerInfo;
    }
});
Object.defineProperty(exports, "Plan", {
    enumerable: true,
    get: function() {
        return result_summary_1.Plan;
    }
});
Object.defineProperty(exports, "ProfiledPlan", {
    enumerable: true,
    get: function() {
        return result_summary_1.ProfiledPlan;
    }
});
Object.defineProperty(exports, "QueryStatistics", {
    enumerable: true,
    get: function() {
        return result_summary_1.QueryStatistics;
    }
});
Object.defineProperty(exports, "Stats", {
    enumerable: true,
    get: function() {
        return result_summary_1.Stats;
    }
});
var notification_1 = __importStar(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/notification.js [app-route] (ecmascript)"));
exports.GqlStatusObject = notification_1.default;
Object.defineProperty(exports, "Notification", {
    enumerable: true,
    get: function() {
        return notification_1.Notification;
    }
});
Object.defineProperty(exports, "notificationCategory", {
    enumerable: true,
    get: function() {
        return notification_1.notificationCategory;
    }
});
Object.defineProperty(exports, "notificationClassification", {
    enumerable: true,
    get: function() {
        return notification_1.notificationClassification;
    }
});
Object.defineProperty(exports, "notificationSeverityLevel", {
    enumerable: true,
    get: function() {
        return notification_1.notificationSeverityLevel;
    }
});
var notification_filter_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/notification-filter.js [app-route] (ecmascript)");
Object.defineProperty(exports, "notificationFilterDisabledCategory", {
    enumerable: true,
    get: function() {
        return notification_filter_1.notificationFilterDisabledCategory;
    }
});
Object.defineProperty(exports, "notificationFilterDisabledClassification", {
    enumerable: true,
    get: function() {
        return notification_filter_1.notificationFilterDisabledClassification;
    }
});
Object.defineProperty(exports, "notificationFilterMinimumSeverityLevel", {
    enumerable: true,
    get: function() {
        return notification_filter_1.notificationFilterMinimumSeverityLevel;
    }
});
var result_1 = __importDefault(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/result.js [app-route] (ecmascript)"));
exports.Result = result_1.default;
var result_eager_1 = __importDefault(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/result-eager.js [app-route] (ecmascript)"));
exports.EagerResult = result_eager_1.default;
var connection_provider_1 = __importStar(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/connection-provider.js [app-route] (ecmascript)"));
exports.ConnectionProvider = connection_provider_1.default;
Object.defineProperty(exports, "Releasable", {
    enumerable: true,
    get: function() {
        return connection_provider_1.Releasable;
    }
});
var connection_1 = __importDefault(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/connection.js [app-route] (ecmascript)"));
exports.Connection = connection_1.default;
var transaction_1 = __importDefault(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/transaction.js [app-route] (ecmascript)"));
exports.Transaction = transaction_1.default;
var transaction_managed_1 = __importDefault(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/transaction-managed.js [app-route] (ecmascript)"));
exports.ManagedTransaction = transaction_managed_1.default;
var transaction_promise_1 = __importDefault(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/transaction-promise.js [app-route] (ecmascript)"));
exports.TransactionPromise = transaction_promise_1.default;
var session_1 = __importDefault(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/session.js [app-route] (ecmascript)"));
exports.Session = session_1.default;
var driver_1 = __importStar(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/driver.js [app-route] (ecmascript)")), driver = driver_1;
exports.Driver = driver_1.default;
exports.driver = driver;
var auth_1 = __importDefault(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/auth.js [app-route] (ecmascript)"));
exports.auth = auth_1.default;
var bookmark_manager_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/bookmark-manager.js [app-route] (ecmascript)");
Object.defineProperty(exports, "bookmarkManager", {
    enumerable: true,
    get: function() {
        return bookmark_manager_1.bookmarkManager;
    }
});
var auth_token_manager_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/auth-token-manager.js [app-route] (ecmascript)");
Object.defineProperty(exports, "authTokenManagers", {
    enumerable: true,
    get: function() {
        return auth_token_manager_1.authTokenManagers;
    }
});
Object.defineProperty(exports, "staticAuthTokenManager", {
    enumerable: true,
    get: function() {
        return auth_token_manager_1.staticAuthTokenManager;
    }
});
var driver_2 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/driver.js [app-route] (ecmascript)");
Object.defineProperty(exports, "routing", {
    enumerable: true,
    get: function() {
        return driver_2.routing;
    }
});
var types = __importStar(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/types.js [app-route] (ecmascript)"));
exports.types = types;
var json = __importStar(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/json.js [app-route] (ecmascript)"));
exports.json = json;
var result_transformers_1 = __importDefault(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/result-transformers.js [app-route] (ecmascript)"));
exports.resultTransformers = result_transformers_1.default;
var client_certificate_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/client-certificate.js [app-route] (ecmascript)");
Object.defineProperty(exports, "clientCertificateProviders", {
    enumerable: true,
    get: function() {
        return client_certificate_1.clientCertificateProviders;
    }
});
Object.defineProperty(exports, "resolveCertificateProvider", {
    enumerable: true,
    get: function() {
        return client_certificate_1.resolveCertificateProvider;
    }
});
var internal = __importStar(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/internal/index.js [app-route] (ecmascript)")); // todo: removed afterwards
exports.internal = internal;
var protocol_version_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/protocol-version.js [app-route] (ecmascript)");
Object.defineProperty(exports, "ProtocolVersion", {
    enumerable: true,
    get: function() {
        return protocol_version_1.ProtocolVersion;
    }
});
var vector_1 = __importStar(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/vector.js [app-route] (ecmascript)"));
exports.Vector = vector_1.default;
Object.defineProperty(exports, "vector", {
    enumerable: true,
    get: function() {
        return vector_1.vector;
    }
});
Object.defineProperty(exports, "isVector", {
    enumerable: true,
    get: function() {
        return vector_1.isVector;
    }
});
var mapping_nameconventions_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/mapping.nameconventions.js [app-route] (ecmascript)");
Object.defineProperty(exports, "StandardCase", {
    enumerable: true,
    get: function() {
        return mapping_nameconventions_1.StandardCase;
    }
});
var mapping_highlevel_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/mapping.highlevel.js [app-route] (ecmascript)");
Object.defineProperty(exports, "RecordObjectMapping", {
    enumerable: true,
    get: function() {
        return mapping_highlevel_1.RecordObjectMapping;
    }
});
var mapping_rulesfactories_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/mapping.rulesfactories.js [app-route] (ecmascript)");
Object.defineProperty(exports, "rule", {
    enumerable: true,
    get: function() {
        return mapping_rulesfactories_1.rule;
    }
});
var mapping_decorators_1 = __importDefault(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/mapping.decorators.js [app-route] (ecmascript)"));
exports.mappingDecorators = mapping_decorators_1.default;
var unsupported_type_1 = __importStar(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/unsupported-type.js [app-route] (ecmascript)"));
exports.UnsupportedType = unsupported_type_1.default;
Object.defineProperty(exports, "isUnsupportedType", {
    enumerable: true,
    get: function() {
        return unsupported_type_1.isUnsupportedType;
    }
});
/**
 * Object containing string constants representing predefined {@link Neo4jError} codes.
 */ var error = {
    SERVICE_UNAVAILABLE: error_1.SERVICE_UNAVAILABLE,
    SESSION_EXPIRED: error_1.SESSION_EXPIRED,
    PROTOCOL_ERROR: error_1.PROTOCOL_ERROR
};
exports.error = error;
/**
 * @private
 */ var forExport = {
    authTokenManagers: auth_token_manager_1.authTokenManagers,
    newError: error_1.newError,
    Neo4jError: error_1.Neo4jError,
    newGQLError: error_1.newGQLError,
    GQLError: error_1.GQLError,
    isRetryableError: error_1.isRetryableError,
    isRetriableError: error_1.isRetriableError,
    error: error,
    Integer: integer_1.default,
    int: integer_1.int,
    isInt: integer_1.isInt,
    inSafeRange: integer_1.inSafeRange,
    toNumber: integer_1.toNumber,
    toString: integer_1.toString,
    internal: internal,
    isPoint: spatial_types_1.isPoint,
    Point: spatial_types_1.Point,
    Date: temporal_types_1.Date,
    DateTime: temporal_types_1.DateTime,
    Duration: temporal_types_1.Duration,
    isDate: temporal_types_1.isDate,
    isDateTime: temporal_types_1.isDateTime,
    isDuration: temporal_types_1.isDuration,
    isLocalDateTime: temporal_types_1.isLocalDateTime,
    isLocalTime: temporal_types_1.isLocalTime,
    isTime: temporal_types_1.isTime,
    LocalDateTime: temporal_types_1.LocalDateTime,
    LocalTime: temporal_types_1.LocalTime,
    Time: temporal_types_1.Time,
    Node: graph_types_1.Node,
    isNode: graph_types_1.isNode,
    Relationship: graph_types_1.Relationship,
    isRelationship: graph_types_1.isRelationship,
    UnboundRelationship: graph_types_1.UnboundRelationship,
    isUnboundRelationship: graph_types_1.isUnboundRelationship,
    Path: graph_types_1.Path,
    isPath: graph_types_1.isPath,
    PathSegment: graph_types_1.PathSegment,
    isPathSegment: graph_types_1.isPathSegment,
    Record: record_1.default,
    ResultSummary: result_summary_1.default,
    queryType: result_summary_1.queryType,
    ServerInfo: result_summary_1.ServerInfo,
    Notification: notification_1.Notification,
    GqlStatusObject: notification_1.default,
    Plan: result_summary_1.Plan,
    ProfiledPlan: result_summary_1.ProfiledPlan,
    QueryStatistics: result_summary_1.QueryStatistics,
    Stats: result_summary_1.Stats,
    Result: result_1.default,
    EagerResult: result_eager_1.default,
    Transaction: transaction_1.default,
    ManagedTransaction: transaction_managed_1.default,
    TransactionPromise: transaction_promise_1.default,
    Session: session_1.default,
    Driver: driver_1.default,
    Connection: connection_1.default,
    Releasable: connection_provider_1.Releasable,
    types: types,
    driver: driver,
    json: json,
    auth: auth_1.default,
    bookmarkManager: bookmark_manager_1.bookmarkManager,
    routing: driver_2.routing,
    resultTransformers: result_transformers_1.default,
    notificationCategory: notification_1.notificationCategory,
    notificationClassification: notification_1.notificationClassification,
    notificationSeverityLevel: notification_1.notificationSeverityLevel,
    notificationFilterDisabledCategory: notification_filter_1.notificationFilterDisabledCategory,
    notificationFilterDisabledClassification: notification_filter_1.notificationFilterDisabledClassification,
    notificationFilterMinimumSeverityLevel: notification_filter_1.notificationFilterMinimumSeverityLevel,
    clientCertificateProviders: client_certificate_1.clientCertificateProviders,
    resolveCertificateProvider: client_certificate_1.resolveCertificateProvider,
    ProtocolVersion: protocol_version_1.ProtocolVersion,
    rule: mapping_rulesfactories_1.rule,
    mappingDecorators: mapping_decorators_1.default,
    RecordObjectMapping: mapping_highlevel_1.RecordObjectMapping,
    StandardCase: mapping_nameconventions_1.StandardCase,
    UnsupportedType: unsupported_type_1.default,
    isUnsupportedType: unsupported_type_1.isUnsupportedType,
    isVector: vector_1.isVector,
    vector: vector_1.vector
};
exports.default = forExport;
}),
];

//# sourceMappingURL=9e883_neo4j-driver-core_lib_b295b518._.js.map