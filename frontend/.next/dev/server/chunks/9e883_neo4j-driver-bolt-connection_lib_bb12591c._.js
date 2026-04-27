module.exports = [
"[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/load-balancing/load-balancing-strategy.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
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
 * A facility to select most appropriate reader or writer among the given addresses for request processing.
 */ var LoadBalancingStrategy = function() {
    function LoadBalancingStrategy() {}
    /**
     * Select next most appropriate reader from the list of given readers.
     * @param {string[]} knownReaders an array of currently known readers to select from.
     * @return {string} most appropriate reader or `null` if given array is empty.
     */ LoadBalancingStrategy.prototype.selectReader = function(knownReaders) {
        throw new Error('Abstract function');
    };
    /**
     * Select next most appropriate writer from the list of given writers.
     * @param {string[]} knownWriters an array of currently known writers to select from.
     * @return {string} most appropriate writer or `null` if given array is empty.
     */ LoadBalancingStrategy.prototype.selectWriter = function(knownWriters) {
        throw new Error('Abstract function');
    };
    return LoadBalancingStrategy;
}();
exports.default = LoadBalancingStrategy;
}),
"[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/load-balancing/round-robin-array-index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
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
var RoundRobinArrayIndex = function() {
    /**
     * @constructor
     * @param {number} [initialOffset=0] the initial offset for round robin.
     */ function RoundRobinArrayIndex(initialOffset) {
        this._offset = initialOffset || 0;
    }
    /**
     * Get next index for an array with given length.
     * @param {number} arrayLength the array length.
     * @return {number} index in the array.
     */ RoundRobinArrayIndex.prototype.next = function(arrayLength) {
        if (arrayLength === 0) {
            return -1;
        }
        var nextOffset = this._offset;
        this._offset += 1;
        if (this._offset === Number.MAX_SAFE_INTEGER) {
            this._offset = 0;
        }
        return nextOffset % arrayLength;
    };
    return RoundRobinArrayIndex;
}();
exports.default = RoundRobinArrayIndex;
}),
"[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/load-balancing/least-connected-load-balancing-strategy.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
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
var __importDefault = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : {
        "default": mod
    };
};
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
 */ var round_robin_array_index_1 = __importDefault(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/load-balancing/round-robin-array-index.js [app-route] (ecmascript)"));
var load_balancing_strategy_1 = __importDefault(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/load-balancing/load-balancing-strategy.js [app-route] (ecmascript)"));
var LeastConnectedLoadBalancingStrategy = function(_super) {
    __extends(LeastConnectedLoadBalancingStrategy, _super);
    /**
     * @constructor
     * @param {Pool} connectionPool the connection pool of this driver.
     */ function LeastConnectedLoadBalancingStrategy(connectionPool) {
        var _this = _super.call(this) || this;
        _this._readersIndex = new round_robin_array_index_1.default();
        _this._writersIndex = new round_robin_array_index_1.default();
        _this._connectionPool = connectionPool;
        return _this;
    }
    /**
     * @inheritDoc
     */ LeastConnectedLoadBalancingStrategy.prototype.selectReader = function(knownReaders) {
        return this._select(knownReaders, this._readersIndex);
    };
    /**
     * @inheritDoc
     */ LeastConnectedLoadBalancingStrategy.prototype.selectWriter = function(knownWriters) {
        return this._select(knownWriters, this._writersIndex);
    };
    LeastConnectedLoadBalancingStrategy.prototype._select = function(addresses, roundRobinIndex) {
        var length = addresses.length;
        if (length === 0) {
            return null;
        }
        // choose start index for iteration in round-robin fashion
        var startIndex = roundRobinIndex.next(length);
        var index = startIndex;
        var leastConnectedAddress = null;
        var leastActiveConnections = Number.MAX_SAFE_INTEGER;
        // iterate over the array to find least connected address
        do {
            var address = addresses[index];
            var activeConnections = this._connectionPool.activeResourceCount(address);
            if (activeConnections < leastActiveConnections) {
                leastConnectedAddress = address;
                leastActiveConnections = activeConnections;
            }
            // loop over to the start of the array when end is reached
            if (index === length - 1) {
                index = 0;
            } else {
                index++;
            }
        }while (index !== startIndex)
        return leastConnectedAddress;
    };
    return LeastConnectedLoadBalancingStrategy;
}(load_balancing_strategy_1.default);
exports.default = LeastConnectedLoadBalancingStrategy;
}),
"[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/load-balancing/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __importDefault = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : {
        "default": mod
    };
};
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.LeastConnectedLoadBalancingStrategy = exports.LoadBalancingStrategy = void 0;
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
 */ var load_balancing_strategy_1 = __importDefault(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/load-balancing/load-balancing-strategy.js [app-route] (ecmascript)"));
exports.LoadBalancingStrategy = load_balancing_strategy_1.default;
var least_connected_load_balancing_strategy_1 = __importDefault(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/load-balancing/least-connected-load-balancing-strategy.js [app-route] (ecmascript)"));
exports.LeastConnectedLoadBalancingStrategy = least_connected_load_balancing_strategy_1.default;
exports.default = least_connected_load_balancing_strategy_1.default;
}),
"[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/buf/base-buf.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
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
/**
 * Common base with default implementation for most buffer methods.
 * Buffers are stateful - they track a current "position", this helps greatly
 * when reading and writing from them incrementally. You can also ignore the
 * stateful read/write methods.
 * readXXX and writeXXX-methods move the inner position of the buffer.
 * putXXX and getXXX-methods do not.
 * @access private
 */ var BaseBuffer = function() {
    /**
     * Create a instance with the injected size.
     * @constructor
     * @param {Integer} size
     */ function BaseBuffer(size) {
        this.position = 0;
        this.length = size;
    }
    BaseBuffer.prototype.getUInt8 = function(position) {
        throw new Error('Not implemented');
    };
    BaseBuffer.prototype.getInt8 = function(position) {
        throw new Error('Not implemented');
    };
    BaseBuffer.prototype.getFloat64 = function(position) {
        throw new Error('Not implemented');
    };
    BaseBuffer.prototype.getVarInt = function(position) {
        throw new Error('Not implemented');
    };
    BaseBuffer.prototype.putUInt8 = function(position, val) {
        throw new Error('Not implemented');
    };
    BaseBuffer.prototype.putInt8 = function(position, val) {
        throw new Error('Not implemented');
    };
    BaseBuffer.prototype.putFloat64 = function(position, val) {
        throw new Error('Not implemented');
    };
    /**
     * @param p
     */ BaseBuffer.prototype.getInt16 = function(p) {
        return this.getInt8(p) << 8 | this.getUInt8(p + 1);
    };
    /**
     * @param p
     */ BaseBuffer.prototype.getUInt16 = function(p) {
        return this.getUInt8(p) << 8 | this.getUInt8(p + 1);
    };
    /**
     * @param p
     */ BaseBuffer.prototype.getInt32 = function(p) {
        return this.getInt8(p) << 24 | this.getUInt8(p + 1) << 16 | this.getUInt8(p + 2) << 8 | this.getUInt8(p + 3);
    };
    /**
     * @param p
     */ BaseBuffer.prototype.getUInt32 = function(p) {
        return this.getUInt8(p) << 24 | this.getUInt8(p + 1) << 16 | this.getUInt8(p + 2) << 8 | this.getUInt8(p + 3);
    };
    /**
     * @param p
     */ BaseBuffer.prototype.getInt64 = function(p) {
        return this.getInt8(p) << 56 | this.getUInt8(p + 1) << 48 | this.getUInt8(p + 2) << 40 | this.getUInt8(p + 3) << 32 | this.getUInt8(p + 4) << 24 | this.getUInt8(p + 5) << 16 | this.getUInt8(p + 6) << 8 | this.getUInt8(p + 7);
    };
    /**
     * Get a slice of this buffer. This method does not copy any data,
     * but simply provides a slice view of this buffer
     * @param start
     * @param length
     */ BaseBuffer.prototype.getSlice = function(start, length) {
        return new SliceBuffer(start, length, this);
    };
    /**
     * @param p
     * @param val
     */ BaseBuffer.prototype.putInt16 = function(p, val) {
        this.putInt8(p, val >> 8);
        this.putUInt8(p + 1, val & 0xff);
    };
    /**
     * @param p
     * @param val
     */ BaseBuffer.prototype.putUInt16 = function(p, val) {
        this.putUInt8(p, val >> 8 & 0xff);
        this.putUInt8(p + 1, val & 0xff);
    };
    /**
     * @param p
     * @param val
     */ BaseBuffer.prototype.putInt32 = function(p, val) {
        this.putInt8(p, val >> 24);
        this.putUInt8(p + 1, val >> 16 & 0xff);
        this.putUInt8(p + 2, val >> 8 & 0xff);
        this.putUInt8(p + 3, val & 0xff);
    };
    /**
     * @param p
     * @param val
     */ BaseBuffer.prototype.putUInt32 = function(p, val) {
        this.putUInt8(p, val >> 24 & 0xff);
        this.putUInt8(p + 1, val >> 16 & 0xff);
        this.putUInt8(p + 2, val >> 8 & 0xff);
        this.putUInt8(p + 3, val & 0xff);
    };
    /**
     * @param p
     * @param val
     */ BaseBuffer.prototype.putInt64 = function(p, val) {
        this.putInt8(p, val >> 48);
        this.putUInt8(p + 1, val >> 42 & 0xff);
        this.putUInt8(p + 2, val >> 36 & 0xff);
        this.putUInt8(p + 3, val >> 30 & 0xff);
        this.putUInt8(p + 4, val >> 24 & 0xff);
        this.putUInt8(p + 5, val >> 16 & 0xff);
        this.putUInt8(p + 6, val >> 8 & 0xff);
        this.putUInt8(p + 7, val & 0xff);
    };
    BaseBuffer.prototype.putVarInt = function(p, val) {
        var length = 0;
        while(val > 1){
            var int = val % 128;
            if (val >= 128) {
                int += 128;
            }
            val = val / 128;
            this.putUInt8(p + length, int);
            length += 1;
        }
        return length;
    };
    /**
     * @param position
     * @param other
     */ BaseBuffer.prototype.putBytes = function(position, other) {
        for(var i = 0, end = other.remaining(); i < end; i++){
            this.putUInt8(position + i, other.readUInt8());
        }
    };
    /**
     * Read from state position.
     */ BaseBuffer.prototype.readUInt8 = function() {
        return this.getUInt8(this._updatePos(1));
    };
    /**
     * Read from state position.
     */ BaseBuffer.prototype.readInt8 = function() {
        return this.getInt8(this._updatePos(1));
    };
    /**
     * Read from state position.
     */ BaseBuffer.prototype.readUInt16 = function() {
        return this.getUInt16(this._updatePos(2));
    };
    /**
     * Read from state position.
     */ BaseBuffer.prototype.readUInt32 = function() {
        return this.getUInt32(this._updatePos(4));
    };
    /**
     * Read from state position.
     */ BaseBuffer.prototype.readInt16 = function() {
        return this.getInt16(this._updatePos(2));
    };
    /**
     * Read from state position.
     */ BaseBuffer.prototype.readInt32 = function() {
        return this.getInt32(this._updatePos(4));
    };
    /**
     * Read from state position.
     */ BaseBuffer.prototype.readInt64 = function() {
        return this.getInt32(this._updatePos(8));
    };
    /**
     * Read from state position.
     */ BaseBuffer.prototype.readFloat64 = function() {
        return this.getFloat64(this._updatePos(8));
    };
    /**
     * Read from state position
     */ BaseBuffer.prototype.readVarInt = function() {
        var int = this.getVarInt(this.position);
        this._updatePos(int.length);
        return int.value;
    };
    /**
     * Write to state position.
     * @param val
     */ BaseBuffer.prototype.writeUInt8 = function(val) {
        this.putUInt8(this._updatePos(1), val);
    };
    /**
     * Write to state position.
     * @param val
     */ BaseBuffer.prototype.writeInt8 = function(val) {
        this.putInt8(this._updatePos(1), val);
    };
    /**
     * Write to state position.
     * @param val
     */ BaseBuffer.prototype.writeInt16 = function(val) {
        this.putInt16(this._updatePos(2), val);
    };
    /**
     * Write to state position.
     * @param val
     */ BaseBuffer.prototype.writeInt32 = function(val) {
        this.putInt32(this._updatePos(4), val);
    };
    /**
     * Write to state position.
     * @param val
     */ BaseBuffer.prototype.writeUInt32 = function(val) {
        this.putUInt32(this._updatePos(4), val);
    };
    /**
     * Write to state position.
     * @param val
     */ BaseBuffer.prototype.writeInt64 = function(val) {
        this.putInt64(this._updatePos(8), val);
    };
    /**
     * Write to state position.
     * @param val
     */ BaseBuffer.prototype.writeFloat64 = function(val) {
        this.putFloat64(this._updatePos(8), val);
    };
    BaseBuffer.prototype.writeVarInt = function(val) {
        var length = this.putVarInt(this.position, val);
        this._updatePos(length);
    };
    /**
     * Write to state position.
     * @param val
     */ BaseBuffer.prototype.writeBytes = function(val) {
        this.putBytes(this._updatePos(val.remaining()), val);
    };
    /**
     * Get a slice of this buffer. This method does not copy any data,
     * but simply provides a slice view of this buffer
     * @param length
     */ BaseBuffer.prototype.readSlice = function(length) {
        return this.getSlice(this._updatePos(length), length);
    };
    BaseBuffer.prototype._updatePos = function(length) {
        var p = this.position;
        this.position += length;
        return p;
    };
    /**
     * Get remaining
     */ BaseBuffer.prototype.remaining = function() {
        return this.length - this.position;
    };
    /**
     * Has remaining
     */ BaseBuffer.prototype.hasRemaining = function() {
        return this.remaining() > 0;
    };
    /**
     * Reset position state
     */ BaseBuffer.prototype.reset = function() {
        this.position = 0;
    };
    /**
     * Get string representation of buffer and it's state.
     * @return {string} Buffer as a string
     */ BaseBuffer.prototype.toString = function() {
        return this.constructor.name + '( position=' + this.position + ' )\n  ' + this.toHex();
    };
    /**
     * Get string representation of buffer.
     * @return {string} Buffer as a string
     */ BaseBuffer.prototype.toHex = function() {
        var out = '';
        for(var i = 0; i < this.length; i++){
            var hexByte = this.getUInt8(i).toString(16);
            if (hexByte.length === 1) {
                hexByte = '0' + hexByte;
            }
            out += hexByte;
            if (i !== this.length - 1) {
                out += ' ';
            }
        }
        return out;
    };
    return BaseBuffer;
}();
exports.default = BaseBuffer;
/**
 * Represents a view as slice of another buffer.
 * @access private
 */ var SliceBuffer = function(_super) {
    __extends(SliceBuffer, _super);
    function SliceBuffer(start, length, inner) {
        var _this = _super.call(this, length) || this;
        _this._start = start;
        _this._inner = inner;
        return _this;
    }
    SliceBuffer.prototype.putUInt8 = function(position, val) {
        this._inner.putUInt8(this._start + position, val);
    };
    SliceBuffer.prototype.getUInt8 = function(position) {
        return this._inner.getUInt8(this._start + position);
    };
    SliceBuffer.prototype.putInt8 = function(position, val) {
        this._inner.putInt8(this._start + position, val);
    };
    SliceBuffer.prototype.putFloat64 = function(position, val) {
        this._inner.putFloat64(this._start + position, val);
    };
    SliceBuffer.prototype.getInt8 = function(position) {
        return this._inner.getInt8(this._start + position);
    };
    SliceBuffer.prototype.getFloat64 = function(position) {
        return this._inner.getFloat64(this._start + position);
    };
    return SliceBuffer;
}(BaseBuffer);
}),
"[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/buf/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
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
 */ var __importDefault = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : {
        "default": mod
    };
};
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.BaseBuffer = void 0;
var base_buf_1 = __importDefault(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/buf/base-buf.js [app-route] (ecmascript)"));
exports.BaseBuffer = base_buf_1.default;
exports.default = base_buf_1.default;
}),
"[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/channel/channel-buf.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
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
var __importDefault = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : {
        "default": mod
    };
};
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.alloc = alloc;
var buffer_1 = __importDefault(__turbopack_context__.r("[externals]/buffer [external] (buffer, cjs)"));
var buf_1 = __importDefault(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/buf/index.js [app-route] (ecmascript)"));
var ChannelBuffer = function(_super) {
    __extends(ChannelBuffer, _super);
    function ChannelBuffer(arg) {
        var _this = this;
        var buffer = newChannelJSBuffer(arg);
        _this = _super.call(this, buffer.length) || this;
        _this._buffer = buffer;
        return _this;
    }
    ChannelBuffer.prototype.getUInt8 = function(position) {
        return this._buffer.readUInt8(position);
    };
    ChannelBuffer.prototype.getInt8 = function(position) {
        return this._buffer.readInt8(position);
    };
    ChannelBuffer.prototype.getFloat64 = function(position) {
        return this._buffer.readDoubleBE(position);
    };
    ChannelBuffer.prototype.getVarInt = function(position) {
        var i = 0;
        var currentValue = this._buffer.readInt8(position + i);
        var total = currentValue % 128;
        while(currentValue / 128 >= 1){
            i += 1;
            currentValue = this._buffer.readInt8(position + i);
            total += currentValue % 128;
        }
        return {
            length: i + 1,
            value: total
        };
    };
    ChannelBuffer.prototype.putUInt8 = function(position, val) {
        this._buffer.writeUInt8(val, position);
    };
    ChannelBuffer.prototype.putInt8 = function(position, val) {
        this._buffer.writeInt8(val, position);
    };
    ChannelBuffer.prototype.putFloat64 = function(position, val) {
        this._buffer.writeDoubleBE(val, position);
    };
    ChannelBuffer.prototype.putBytes = function(position, val) {
        if (val instanceof ChannelBuffer) {
            var bytesToCopy = Math.min(val.length - val.position, this.length - position);
            val._buffer.copy(this._buffer, position, val.position, val.position + bytesToCopy);
            val.position += bytesToCopy;
        } else {
            _super.prototype.putBytes.call(this, position, val);
        }
    };
    ChannelBuffer.prototype.getSlice = function(start, length) {
        return new ChannelBuffer(this._buffer.slice(start, start + length));
    };
    return ChannelBuffer;
}(buf_1.default);
exports.default = ChannelBuffer;
/**
 * Allocate a buffer
 *
 * @param {number} size The buffer sizzer
 * @returns {BaseBuffer} The buffer
 */ function alloc(size) {
    return new ChannelBuffer(size);
}
function newChannelJSBuffer(arg) {
    if (arg instanceof buffer_1.default.Buffer) {
        return arg;
    } else if (typeof arg === 'number' && typeof buffer_1.default.Buffer.alloc === 'function') {
        // use static factory function present in newer NodeJS versions to allocate new buffer with specified size
        return buffer_1.default.Buffer.alloc(arg);
    } else {
        // fallback to the old, potentially deprecated constructor
        // eslint-disable-next-line n/no-deprecated-api
        return new buffer_1.default.Buffer(arg);
    }
}
}),
"[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/channel/node/node-channel.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
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
var __importDefault = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : {
        "default": mod
    };
};
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
 */ var net_1 = __importDefault(__turbopack_context__.r("[externals]/net [external] (net, cjs)"));
var tls_1 = __importDefault(__turbopack_context__.r("[externals]/tls [external] (tls, cjs)"));
var fs_1 = __importDefault(__turbopack_context__.r("[externals]/fs [external] (fs, cjs)"));
var channel_buf_1 = __importDefault(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/channel/channel-buf.js [app-route] (ecmascript)"));
var neo4j_driver_core_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/index.js [app-route] (ecmascript)");
var _a = neo4j_driver_core_1.internal.util, ENCRYPTION_OFF = _a.ENCRYPTION_OFF, ENCRYPTION_ON = _a.ENCRYPTION_ON, isEmptyObjectOrNull = _a.isEmptyObjectOrNull;
var _CONNECTION_IDGEN = 0;
var TrustStrategy = {
    TRUST_CUSTOM_CA_SIGNED_CERTIFICATES: function(config, onSuccess, onFailure) {
        if (!config.trustedCertificates || config.trustedCertificates.length === 0) {
            onFailure((0, neo4j_driver_core_1.newError)('You are using TRUST_CUSTOM_CA_SIGNED_CERTIFICATES as the method ' + 'to verify trust for encrypted  connections, but have not configured any ' + 'trustedCertificates. You  must specify the path to at least one trusted ' + 'X.509 certificate for this to work. Two other alternatives is to use ' + 'TRUST_ALL_CERTIFICATES or to disable encryption by setting encrypted="' + ENCRYPTION_OFF + '"' + 'in your driver configuration.'));
            return;
        }
        var tlsOpts = newTlsOptions(config.address.host(), config.trustedCertificates.map(function(f) {
            return fs_1.default.readFileSync(f);
        }), config.clientCertificate);
        var socket = tls_1.default.connect(config.address.port(), config.address.resolvedHost(), tlsOpts, function() {
            if (!socket.authorized) {
                onFailure((0, neo4j_driver_core_1.newError)('Server certificate is not trusted. If you trust the database you are connecting to, add' + ' the signing certificate, or the server certificate, to the list of certificates trusted by this driver' + " using `neo4j.driver(.., { trustedCertificates:['path/to/certificate.crt']}). This " + ' is a security measure to protect against man-in-the-middle attacks. If you are just trying ' + ' Neo4j out and are not concerned about encryption, simply disable it using `encrypted="' + ENCRYPTION_OFF + '"`' + ' in the driver options. Socket responded with: ' + socket.authorizationError));
            } else {
                onSuccess();
            }
        });
        socket.on('error', onFailure);
        return configureSocket(socket);
    },
    TRUST_SYSTEM_CA_SIGNED_CERTIFICATES: function(config, onSuccess, onFailure) {
        var tlsOpts = newTlsOptions(config.address.host(), undefined, config.clientCertificate);
        var socket = tls_1.default.connect(config.address.port(), config.address.resolvedHost(), tlsOpts, function() {
            if (!socket.authorized) {
                onFailure((0, neo4j_driver_core_1.newError)('Server certificate is not trusted. If you trust the database you are connecting to, use ' + 'TRUST_CUSTOM_CA_SIGNED_CERTIFICATES and add' + ' the signing certificate, or the server certificate, to the list of certificates trusted by this driver' + " using `neo4j.driver(.., { trustedCertificates:['path/to/certificate.crt']}). This " + ' is a security measure to protect against man-in-the-middle attacks. If you are just trying ' + ' Neo4j out and are not concerned about encryption, simply disable it using `encrypted="' + ENCRYPTION_OFF + '"`' + ' in the driver options. Socket responded with: ' + socket.authorizationError));
            } else {
                onSuccess();
            }
        });
        socket.on('error', onFailure);
        return configureSocket(socket);
    },
    TRUST_ALL_CERTIFICATES: function(config, onSuccess, onFailure) {
        var tlsOpts = newTlsOptions(config.address.host(), undefined, config.clientCertificate);
        var socket = tls_1.default.connect(config.address.port(), config.address.resolvedHost(), tlsOpts, function() {
            var certificate = socket.getPeerCertificate();
            if (isEmptyObjectOrNull(certificate)) {
                onFailure((0, neo4j_driver_core_1.newError)('Secure connection was successful but server did not return any valid ' + 'certificates. Such connection can not be trusted. If you are just trying ' + ' Neo4j out and are not concerned about encryption, simply disable it using ' + '`encrypted="' + ENCRYPTION_OFF + '"` in the driver options. ' + 'Socket responded with: ' + socket.authorizationError));
            } else {
                onSuccess();
            }
        });
        socket.on('error', onFailure);
        return configureSocket(socket);
    }
};
/**
 * Connect using node socket.
 * @param {ChannelConfig} config - configuration of this channel.
 * @param {function} onSuccess - callback to execute on connection success.
 * @param {function} onFailure - callback to execute on connection failure.
 * @return {*} socket connection.
 */ function _connect(config, onSuccess, onFailure) {
    if (onFailure === void 0) {
        onFailure = function() {
            return null;
        };
    }
    var trustStrategy = trustStrategyName(config);
    if (!isEncrypted(config)) {
        var socket = net_1.default.connect(config.address.port(), config.address.resolvedHost(), onSuccess);
        socket.on('error', onFailure);
        return configureSocket(socket);
    } else if (TrustStrategy[trustStrategy]) {
        return TrustStrategy[trustStrategy](config, onSuccess, onFailure);
    } else {
        onFailure((0, neo4j_driver_core_1.newError)('Unknown trust strategy: ' + config.trust + '. Please use either ' + "trust:'TRUST_CUSTOM_CA_SIGNED_CERTIFICATES' or trust:'TRUST_ALL_CERTIFICATES' in your driver " + 'configuration. Alternatively, you can disable encryption by setting ' + '`encrypted:"' + ENCRYPTION_OFF + '"`. There is no mechanism to use encryption without trust verification, ' + 'because this incurs the overhead of encryption without improving security. If ' + 'the driver does not verify that the peer it is connected to is really Neo4j, it ' + 'is very easy for an attacker to bypass the encryption by pretending to be Neo4j.'));
    }
}
function isEncrypted(config) {
    var encryptionNotConfigured = config.encrypted == null || config.encrypted === undefined;
    if (encryptionNotConfigured) {
        // default to using encryption if trust-all-certificates is available
        return false;
    }
    return config.encrypted === true || config.encrypted === ENCRYPTION_ON;
}
function trustStrategyName(config) {
    if (config.trust) {
        return config.trust;
    }
    return 'TRUST_SYSTEM_CA_SIGNED_CERTIFICATES';
}
/**
 * Create a new configuration options object for the {@code tls.connect()} call.
 * @param {string} hostname the target hostname.
 * @param {string|undefined} ca an optional CA.
 * @param {string|undefined} cert an optional client cert.
 * @param {string|undefined} key an optional client cert key.
 * @param {string|undefined} passphrase an optional client cert passphrase
 * @return {Object} a new options object.
 */ function newTlsOptions(hostname, ca, clientCertificate) {
    if (ca === void 0) {
        ca = undefined;
    }
    if (clientCertificate === void 0) {
        clientCertificate = undefined;
    }
    return __assign({
        rejectUnauthorized: false,
        servername: hostname,
        ca: ca
    }, clientCertificate);
}
/**
 * Update socket options for the newly created socket. Accepts either `net.Socket` or its subclass `tls.TLSSocket`.
 * @param {net.Socket} socket the socket to configure.
 * @return {net.Socket} the given socket.
 */ function configureSocket(socket) {
    socket.setKeepAlive(true);
    return socket;
}
/**
 * In a Node.js environment the 'net' module is used
 * as transport.
 * @access private
 */ var NodeChannel = function() {
    /**
     * Create new instance
     * @param {ChannelConfig} config - configuration for this channel.
     */ function NodeChannel(config, connect) {
        if (connect === void 0) {
            connect = _connect;
        }
        var self = this;
        this.id = _CONNECTION_IDGEN++;
        this._pending = [];
        this._open = true;
        this._error = null;
        this._handleConnectionError = this._handleConnectionError.bind(this);
        this._handleConnectionTerminated = this._handleConnectionTerminated.bind(this);
        this._connectionErrorCode = config.connectionErrorCode;
        this._receiveTimeout = null;
        this._receiveTimeoutStarted = false;
        this._conn = connect(config, function() {
            if (!self._open) {
                return;
            }
            self._conn.on('data', function(buffer) {
                if (self.onmessage) {
                    self.onmessage(new channel_buf_1.default(buffer));
                }
            });
            self._conn.on('end', self._handleConnectionTerminated);
            // Drain all pending messages
            var pending = self._pending;
            self._pending = null;
            for(var i = 0; i < pending.length; i++){
                self.write(pending[i]);
            }
        }, this._handleConnectionError);
        this._setupConnectionTimeout(config, this._conn);
    }
    NodeChannel.prototype._handleConnectionError = function(err) {
        var msg = 'Failed to connect to server. ' + 'Please ensure that your database is listening on the correct host and port ' + 'and that you have compatible encryption settings both on Neo4j server and driver. ' + 'Note that the default encryption setting has changed in Neo4j 4.0.';
        if (err.message) msg += ' Caused by: ' + err.message;
        if (this._conn.destroyed) {
            this._open = false;
        }
        this._error = (0, neo4j_driver_core_1.newError)(msg, this._connectionErrorCode);
        if (this.onerror) {
            this.onerror(this._error);
        }
    };
    NodeChannel.prototype._handleConnectionTerminated = function() {
        this._open = false;
        this._error = (0, neo4j_driver_core_1.newError)('Connection was closed by server', this._connectionErrorCode);
        if (this.onerror) {
            this.onerror(this._error);
        }
    };
    /**
     * Setup connection timeout on the socket, if configured.
     * @param {ChannelConfig} config - configuration of this channel.
     * @param {Object} socket - `net.Socket` or `tls.TLSSocket` object.
     * @private
     */ NodeChannel.prototype._setupConnectionTimeout = function(config, socket) {
        var _this = this;
        var timeout = config.connectionTimeout;
        if (timeout) {
            var connectListener_1 = function() {
                // connected - clear connection timeout
                socket.setTimeout(0);
            };
            var timeoutListener_1 = function() {
                // timeout fired - not connected within configured time. cancel timeout and destroy socket
                socket.setTimeout(0);
                socket.destroy((0, neo4j_driver_core_1.newError)("Failed to establish connection in ".concat(timeout, "ms"), config.connectionErrorCode));
            };
            socket.on('connect', connectListener_1);
            socket.on('timeout', timeoutListener_1);
            this._removeConnectionTimeoutListeners = function() {
                _this._conn.off('connect', connectListener_1);
                _this._conn.off('timeout', timeoutListener_1);
            };
            socket.setTimeout(timeout);
        }
    };
    /**
     * Setup the receive timeout for the channel.
     *
     * @param {number} receiveTimeout How long the channel will wait for receiving data before timing out (ms)
     * @returns {void}
     */ NodeChannel.prototype.setupReceiveTimeout = function(receiveTimeout) {
        var _this = this;
        if (this._removeConnectionTimeoutListeners) {
            this._removeConnectionTimeoutListeners();
        }
        this._conn.on('timeout', function() {
            _this._conn.destroy((0, neo4j_driver_core_1.newError)("Connection lost. Server didn't respond in ".concat(receiveTimeout, "ms"), _this._connectionErrorCode));
        });
        this._receiveTimeout = receiveTimeout;
    };
    /**
     * Stops the receive timeout for the channel.
     */ NodeChannel.prototype.stopReceiveTimeout = function() {
        if (this._receiveTimeout !== null && this._receiveTimeoutStarted) {
            this._receiveTimeoutStarted = false;
            this._conn.setTimeout(0);
        }
    };
    /**
     * Start the receive timeout for the channel.
     */ NodeChannel.prototype.startReceiveTimeout = function() {
        if (this._receiveTimeout !== null && !this._receiveTimeoutStarted) {
            this._receiveTimeoutStarted = true;
            this._conn.setTimeout(this._receiveTimeout);
        }
    };
    /**
     * Write the passed in buffer to connection
     * @param {ChannelBuffer} buffer - Buffer to write
     */ NodeChannel.prototype.write = function(buffer) {
        // If there is a pending queue, push this on that queue. This means
        // we are not yet connected, so we queue things locally.
        if (this._pending !== null) {
            this._pending.push(buffer);
        } else if (buffer instanceof channel_buf_1.default) {
            this._conn.write(buffer._buffer);
        } else {
            throw (0, neo4j_driver_core_1.newError)("Don't know how to write: " + buffer);
        }
    };
    /**
     * Close the connection
     * @returns {Promise} A promise that will be resolved after channel is closed
     */ NodeChannel.prototype.close = function() {
        var _this = this;
        return new Promise(function(resolve, reject) {
            var cleanup = function() {
                if (!_this._conn.destroyed) {
                    _this._conn.destroy();
                }
                resolve();
            };
            if (_this._open) {
                _this._open = false;
                _this._conn.removeListener('end', _this._handleConnectionTerminated);
                _this._conn.on('end', function() {
                    return cleanup();
                });
                _this._conn.on('close', function() {
                    return cleanup();
                });
                _this._conn.end();
                _this._conn.destroy();
            } else {
                cleanup();
            }
        });
    };
    return NodeChannel;
}();
exports.default = NodeChannel;
}),
"[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/channel/node/node-host-name-resolver.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
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
var __importDefault = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : {
        "default": mod
    };
};
Object.defineProperty(exports, "__esModule", {
    value: true
});
var dns_1 = __importDefault(__turbopack_context__.r("[externals]/dns [external] (dns, cjs)"));
var neo4j_driver_core_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/index.js [app-route] (ecmascript)");
var BaseHostNameResolver = neo4j_driver_core_1.internal.resolver.BaseHostNameResolver;
var NodeHostNameResolver = function(_super) {
    __extends(NodeHostNameResolver, _super);
    function NodeHostNameResolver() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NodeHostNameResolver.prototype.resolve = function(address) {
        return new Promise(function(resolve) {
            dns_1.default.lookup(address.host(), {
                all: true
            }, function(error, resolvedTo) {
                if (error) {
                    resolve([
                        address
                    ]);
                } else {
                    var resolvedAddresses = resolvedTo.map(function(a) {
                        return address.resolveWith(a.address);
                    });
                    resolve(resolvedAddresses);
                }
            });
        });
    };
    return NodeHostNameResolver;
}(BaseHostNameResolver);
exports.default = NodeHostNameResolver;
}),
"[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/channel/node/node-client-certificates-loader.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
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
var __importDefault = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : {
        "default": mod
    };
};
Object.defineProperty(exports, "__esModule", {
    value: true
});
var fs_1 = __importDefault(__turbopack_context__.r("[externals]/fs [external] (fs, cjs)"));
function readFile(file) {
    return new Promise(function(resolve, reject) {
        return fs_1.default.readFile(file, function(err, data) {
            if (err) {
                return reject(err);
            }
            return resolve(data);
        });
    });
}
function loadCert(fileOrFiles) {
    if (Array.isArray(fileOrFiles)) {
        return Promise.all(fileOrFiles.map(loadCert));
    }
    return readFile(fileOrFiles);
}
function loadKey(fileOrFiles) {
    if (Array.isArray(fileOrFiles)) {
        return Promise.all(fileOrFiles.map(loadKey));
    }
    if (typeof fileOrFiles === 'string') {
        return readFile(fileOrFiles);
    }
    return readFile(fileOrFiles.path).then(function(pem) {
        return {
            pem: pem,
            passphrase: fileOrFiles.password
        };
    });
}
exports.default = {
    load: function(clientCertificate) {
        return __awaiter(this, void 0, void 0, function() {
            var certPromise, keyPromise, _a, cert, key;
            return __generator(this, function(_b) {
                switch(_b.label){
                    case 0:
                        certPromise = loadCert(clientCertificate.certfile);
                        keyPromise = loadKey(clientCertificate.keyfile);
                        return [
                            4 /*yield*/ ,
                            Promise.all([
                                certPromise,
                                keyPromise
                            ])
                        ];
                    case 1:
                        _a = __read.apply(void 0, [
                            _b.sent(),
                            2
                        ]), cert = _a[0], key = _a[1];
                        return [
                            2 /*return*/ ,
                            {
                                cert: cert,
                                key: key,
                                passphrase: clientCertificate.password
                            }
                        ];
                }
            });
        });
    }
};
}),
"[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/channel/node/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
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
 */ var __importDefault = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : {
        "default": mod
    };
};
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ClientCertificatesLoader = exports.HostNameResolver = exports.Channel = void 0;
var node_channel_1 = __importDefault(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/channel/node/node-channel.js [app-route] (ecmascript)"));
var node_host_name_resolver_1 = __importDefault(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/channel/node/node-host-name-resolver.js [app-route] (ecmascript)"));
var node_client_certificates_loader_1 = __importDefault(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/channel/node/node-client-certificates-loader.js [app-route] (ecmascript)"));
/*

This module exports a set of components to be used in NodeJS environment.
They are not compatible with browser environment.
All files that require environment-dependent APIs should import this file by default.
Imports/requires are replaced at build time with `browser/index.js` when building a browser bundle.

NOTE: exports in this module should have exactly the same names/structure as exports in `browser/index.js`.

 */ exports.Channel = node_channel_1.default;
exports.HostNameResolver = node_host_name_resolver_1.default;
exports.ClientCertificatesLoader = node_client_certificates_loader_1.default;
}),
"[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/channel/combined-buf.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
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
var buf_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/buf/index.js [app-route] (ecmascript)");
var channel_buf_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/channel/channel-buf.js [app-route] (ecmascript)");
/**
 * Buffer that combines multiple buffers, exposing them as one single buffer.
 */ var CombinedBuffer = function(_super) {
    __extends(CombinedBuffer, _super);
    function CombinedBuffer(buffers) {
        var _this = this;
        var length = 0;
        for(var i = 0; i < buffers.length; i++){
            length += buffers[i].length;
        }
        _this = _super.call(this, length) || this;
        _this._buffers = buffers;
        return _this;
    }
    CombinedBuffer.prototype.getUInt8 = function(position) {
        // Surely there's a faster way to do this.. some sort of lookup table thing?
        for(var i = 0; i < this._buffers.length; i++){
            var buffer = this._buffers[i];
            // If the position is not in the current buffer, skip the current buffer
            if (position >= buffer.length) {
                position -= buffer.length;
            } else {
                return buffer.getUInt8(position);
            }
        }
    };
    CombinedBuffer.prototype.getInt8 = function(position) {
        // Surely there's a faster way to do this.. some sort of lookup table thing?
        for(var i = 0; i < this._buffers.length; i++){
            var buffer = this._buffers[i];
            // If the position is not in the current buffer, skip the current buffer
            if (position >= buffer.length) {
                position -= buffer.length;
            } else {
                return buffer.getInt8(position);
            }
        }
    };
    CombinedBuffer.prototype.getFloat64 = function(position) {
        // At some point, a more efficient impl. For now, we copy the 8 bytes
        // we want to read and depend on the platform impl of IEEE 754.
        var b = (0, channel_buf_1.alloc)(8);
        for(var i = 0; i < 8; i++){
            b.putUInt8(i, this.getUInt8(position + i));
        }
        return b.getFloat64(0);
    };
    return CombinedBuffer;
}(buf_1.BaseBuffer);
exports.default = CombinedBuffer;
}),
"[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/channel/chunking.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
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
var __importDefault = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : {
        "default": mod
    };
};
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Dechunker = exports.Chunker = void 0;
var base_buf_1 = __importDefault(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/buf/base-buf.js [app-route] (ecmascript)"));
var channel_buf_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/channel/channel-buf.js [app-route] (ecmascript)");
var combined_buf_1 = __importDefault(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/channel/combined-buf.js [app-route] (ecmascript)"));
var _CHUNK_HEADER_SIZE = 2;
var _MESSAGE_BOUNDARY = 0x00;
var _DEFAULT_BUFFER_SIZE = 1400; // http://stackoverflow.com/questions/2613734/maximum-packet-size-for-a-tcp-connection
/**
 * Looks like a writable buffer, chunks output transparently into a channel below.
 * @access private
 */ var Chunker = function(_super) {
    __extends(Chunker, _super);
    function Chunker(channel, bufferSize) {
        var _this = _super.call(this, 0) || this;
        _this._bufferSize = bufferSize || _DEFAULT_BUFFER_SIZE;
        _this._ch = channel;
        _this._buffer = (0, channel_buf_1.alloc)(_this._bufferSize);
        _this._currentChunkStart = 0;
        _this._chunkOpen = false;
        return _this;
    }
    Chunker.prototype.putUInt8 = function(position, val) {
        this._ensure(1);
        this._buffer.writeUInt8(val);
    };
    Chunker.prototype.putInt8 = function(position, val) {
        this._ensure(1);
        this._buffer.writeInt8(val);
    };
    Chunker.prototype.putFloat64 = function(position, val) {
        this._ensure(8);
        this._buffer.writeFloat64(val);
    };
    Chunker.prototype.putBytes = function(position, data) {
        // TODO: If data is larger than our chunk size or so, we're very likely better off just passing this buffer on
        // rather than doing the copy here TODO: *however* note that we need some way to find out when the data has been
        // written (and thus the buffer can be re-used) if we take that approach
        while(data.remaining() > 0){
            // Ensure there is an open chunk, and that it has at least one byte of space left
            this._ensure(1);
            if (this._buffer.remaining() > data.remaining()) {
                this._buffer.writeBytes(data);
            } else {
                this._buffer.writeBytes(data.readSlice(this._buffer.remaining()));
            }
        }
        return this;
    };
    Chunker.prototype.flush = function() {
        if (this._buffer.position > 0) {
            this._closeChunkIfOpen();
            // Local copy and clear the buffer field. This ensures that the buffer is not re-released if the flush call fails
            var out = this._buffer;
            this._buffer = null;
            this._ch.write(out.getSlice(0, out.position));
            // Alloc a new output buffer. We assume we're using NodeJS's buffer pooling under the hood here!
            this._buffer = (0, channel_buf_1.alloc)(this._bufferSize);
            this._chunkOpen = false;
        }
        return this;
    };
    /**
     * Bolt messages are encoded in one or more chunks, and the boundary between two messages
     * is encoded as a 0-length chunk, `00 00`. This inserts such a message boundary, closing
     * any currently open chunk as needed
     */ Chunker.prototype.messageBoundary = function() {
        this._closeChunkIfOpen();
        if (this._buffer.remaining() < _CHUNK_HEADER_SIZE) {
            this.flush();
        }
        // Write message boundary
        this._buffer.writeInt16(_MESSAGE_BOUNDARY);
    };
    /** Ensure at least the given size is available for writing */ Chunker.prototype._ensure = function(size) {
        var toWriteSize = this._chunkOpen ? size : size + _CHUNK_HEADER_SIZE;
        if (this._buffer.remaining() < toWriteSize) {
            this.flush();
        }
        if (!this._chunkOpen) {
            this._currentChunkStart = this._buffer.position;
            this._buffer.position = this._buffer.position + _CHUNK_HEADER_SIZE;
            this._chunkOpen = true;
        }
    };
    Chunker.prototype._closeChunkIfOpen = function() {
        if (this._chunkOpen) {
            var chunkSize = this._buffer.position - (this._currentChunkStart + _CHUNK_HEADER_SIZE);
            this._buffer.putUInt16(this._currentChunkStart, chunkSize);
            this._chunkOpen = false;
        }
    };
    return Chunker;
}(base_buf_1.default);
exports.Chunker = Chunker;
/**
 * Combines chunks until a complete message is gathered up, and then forwards that
 * message to an 'onmessage' listener.
 * @access private
 */ var Dechunker = function() {
    function Dechunker() {
        this._currentMessage = [];
        this._partialChunkHeader = 0;
        this._state = this.AWAITING_CHUNK;
    }
    Dechunker.prototype.AWAITING_CHUNK = function(buf) {
        if (buf.remaining() >= 2) {
            // Whole header available, read that
            return this._onHeader(buf.readUInt16());
        } else {
            // Only one byte available, read that and wait for the second byte
            this._partialChunkHeader = buf.readUInt8() << 8;
            return this.IN_HEADER;
        }
    };
    Dechunker.prototype.IN_HEADER = function(buf) {
        // First header byte read, now we read the next one
        return this._onHeader((this._partialChunkHeader | buf.readUInt8()) & 0xffff);
    };
    Dechunker.prototype.IN_CHUNK = function(buf) {
        if (this._chunkSize <= buf.remaining()) {
            // Current packet is larger than current chunk, or same size:
            this._currentMessage.push(buf.readSlice(this._chunkSize));
            return this.AWAITING_CHUNK;
        } else {
            // Current packet is smaller than the chunk we're reading, split the current chunk itself up
            this._chunkSize -= buf.remaining();
            this._currentMessage.push(buf.readSlice(buf.remaining()));
            return this.IN_CHUNK;
        }
    };
    Dechunker.prototype.CLOSED = function(buf) {
    // no-op
    };
    /** Called when a complete chunk header has been received */ Dechunker.prototype._onHeader = function(header) {
        if (header === 0) {
            // Message boundary
            var message = void 0;
            switch(this._currentMessage.length){
                case 0:
                    // Keep alive chunk, sent by server to keep network alive.
                    return this.AWAITING_CHUNK;
                case 1:
                    // All data in one chunk, this signals the end of that chunk.
                    message = this._currentMessage[0];
                    break;
                default:
                    // A large chunk of data received, this signals that the last chunk has been received.
                    message = new combined_buf_1.default(this._currentMessage);
                    break;
            }
            this._currentMessage = [];
            this.onmessage(message);
            return this.AWAITING_CHUNK;
        } else {
            this._chunkSize = header;
            return this.IN_CHUNK;
        }
    };
    Dechunker.prototype.write = function(buf) {
        while(buf.hasRemaining()){
            this._state = this._state(buf);
        }
    };
    return Dechunker;
}();
exports.Dechunker = Dechunker;
}),
"[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/channel/channel-config.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
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
var neo4j_driver_core_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/index.js [app-route] (ecmascript)");
var _a = neo4j_driver_core_1.internal.util, ENCRYPTION_OFF = _a.ENCRYPTION_OFF, ENCRYPTION_ON = _a.ENCRYPTION_ON;
var SERVICE_UNAVAILABLE = neo4j_driver_core_1.error.SERVICE_UNAVAILABLE;
var ALLOWED_VALUES_ENCRYPTED = [
    null,
    undefined,
    true,
    false,
    ENCRYPTION_ON,
    ENCRYPTION_OFF
];
var ALLOWED_VALUES_TRUST = [
    null,
    undefined,
    'TRUST_ALL_CERTIFICATES',
    'TRUST_CUSTOM_CA_SIGNED_CERTIFICATES',
    'TRUST_SYSTEM_CA_SIGNED_CERTIFICATES'
];
var ChannelConfig = function() {
    /**
     * @constructor
     * @param {ServerAddress} address the address for the channel to connect to.
     * @param {Object} driverConfig the driver config provided by the user when driver is created.
     * @param {string} connectionErrorCode the default error code to use on connection errors.
     * @param {object} clientCertificate the client certificate
     */ function ChannelConfig(address, driverConfig, connectionErrorCode, clientCertificate) {
        this.address = address;
        this.encrypted = extractEncrypted(driverConfig);
        this.trust = extractTrust(driverConfig);
        this.trustedCertificates = extractTrustedCertificates(driverConfig);
        this.connectionErrorCode = connectionErrorCode || SERVICE_UNAVAILABLE;
        this.connectionTimeout = driverConfig.connectionTimeout;
        this.clientCertificate = clientCertificate;
    }
    return ChannelConfig;
}();
exports.default = ChannelConfig;
function extractEncrypted(driverConfig) {
    var value = driverConfig.encrypted;
    if (ALLOWED_VALUES_ENCRYPTED.indexOf(value) === -1) {
        throw (0, neo4j_driver_core_1.newError)("Illegal value of the encrypted setting ".concat(value, ". Expected one of ").concat(ALLOWED_VALUES_ENCRYPTED));
    }
    return value;
}
function extractTrust(driverConfig) {
    var value = driverConfig.trust;
    if (ALLOWED_VALUES_TRUST.indexOf(value) === -1) {
        throw (0, neo4j_driver_core_1.newError)("Illegal value of the trust setting ".concat(value, ". Expected one of ").concat(ALLOWED_VALUES_TRUST));
    }
    return value;
}
function extractTrustedCertificates(driverConfig) {
    return driverConfig.trustedCertificates || [];
}
}),
"[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/channel/utf8.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
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
 */ var __importDefault = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : {
        "default": mod
    };
};
Object.defineProperty(exports, "__esModule", {
    value: true
});
var channel_buf_1 = __importDefault(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/channel/channel-buf.js [app-route] (ecmascript)"));
var neo4j_driver_core_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/index.js [app-route] (ecmascript)");
var buffer_1 = __importDefault(__turbopack_context__.r("[externals]/buffer [external] (buffer, cjs)"));
var string_decoder_1 = __turbopack_context__.r("[externals]/string_decoder [external] (string_decoder, cjs)");
var decoder = new string_decoder_1.StringDecoder('utf8');
function encode(str) {
    return new channel_buf_1.default(newBuffer(str));
}
function decode(buffer, length) {
    if (Object.prototype.hasOwnProperty.call(buffer, '_buffer')) {
        return decodeChannelBuffer(buffer, length);
    } else if (Object.prototype.hasOwnProperty.call(buffer, '_buffers')) {
        return decodeCombinedBuffer(buffer, length);
    } else {
        throw (0, neo4j_driver_core_1.newError)("Don't know how to decode strings from '".concat(buffer, "'"));
    }
}
function decodeChannelBuffer(buffer, length) {
    var start = buffer.position;
    var end = start + length;
    buffer.position = Math.min(end, buffer.length);
    return buffer._buffer.toString('utf8', start, end);
}
function decodeCombinedBuffer(buffer, length) {
    return streamDecodeCombinedBuffer(buffer, length, function(partBuffer) {
        return decoder.write(partBuffer._buffer);
    }, function() {
        return decoder.end();
    });
}
function streamDecodeCombinedBuffer(combinedBuffers, length, decodeFn, endFn) {
    var remainingBytesToRead = length;
    var position = combinedBuffers.position;
    combinedBuffers._updatePos(Math.min(length, combinedBuffers.length - position));
    // Reduce CombinedBuffers to a decoded string
    var out = combinedBuffers._buffers.reduce(function(last, partBuffer) {
        if (remainingBytesToRead <= 0) {
            return last;
        } else if (position >= partBuffer.length) {
            position -= partBuffer.length;
            return '';
        } else {
            partBuffer._updatePos(position - partBuffer.position);
            var bytesToRead = Math.min(partBuffer.length - position, remainingBytesToRead);
            var lastSlice = partBuffer.readSlice(bytesToRead);
            partBuffer._updatePos(bytesToRead);
            remainingBytesToRead = Math.max(remainingBytesToRead - lastSlice.length, 0);
            position = 0;
            return last + decodeFn(lastSlice);
        }
    }, '');
    return out + endFn();
}
function newBuffer(str) {
    // use static factory function present in newer NodeJS versions to create a buffer containing the given string
    // or fallback to the old, potentially deprecated constructor
    if (typeof buffer_1.default.Buffer.from === 'function') {
        return buffer_1.default.Buffer.from(str, 'utf8');
    } else {
        // eslint-disable-next-line n/no-deprecated-api
        return new buffer_1.default.Buffer(str, 'utf8');
    }
}
exports.default = {
    encode: encode,
    decode: decode
};
}),
"[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/channel/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
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
var __importDefault = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : {
        "default": mod
    };
};
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.utf8 = exports.alloc = exports.ChannelConfig = void 0;
__exportStar(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/channel/node/index.js [app-route] (ecmascript)"), exports);
__exportStar(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/channel/chunking.js [app-route] (ecmascript)"), exports);
var channel_config_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/channel/channel-config.js [app-route] (ecmascript)");
Object.defineProperty(exports, "ChannelConfig", {
    enumerable: true,
    get: function() {
        return __importDefault(channel_config_1).default;
    }
});
var channel_buf_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/channel/channel-buf.js [app-route] (ecmascript)");
Object.defineProperty(exports, "alloc", {
    enumerable: true,
    get: function() {
        return channel_buf_1.alloc;
    }
});
var utf8_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/channel/utf8.js [app-route] (ecmascript)");
Object.defineProperty(exports, "utf8", {
    enumerable: true,
    get: function() {
        return __importDefault(utf8_1).default;
    }
});
}),
"[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/handshake.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
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
exports.default = handshake;
var channel_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/channel/index.js [app-route] (ecmascript)");
var neo4j_driver_core_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/index.js [app-route] (ecmascript)");
var BOLT_MAGIC_PREAMBLE = 0x6060b017;
var AVAILABLE_BOLT_PROTOCOLS = [
    '6.0',
    '5.8',
    '5.7',
    '5.6',
    '5.4',
    '5.3',
    '5.2',
    '5.1',
    '5.0',
    '4.4',
    '4.3',
    '4.2',
    '3.0'
]; // bolt protocols the client will accept, ordered by preference
var DESIRED_CAPABILITES = 0;
function version(major, minor) {
    return {
        major: major,
        minor: minor
    };
}
function createHandshakeMessage(versions) {
    if (versions.length > 4) {
        throw (0, neo4j_driver_core_1.newError)('It should not have more than 4 versions of the protocol');
    }
    var handshakeBuffer = (0, channel_1.alloc)(5 * 4);
    handshakeBuffer.writeInt32(BOLT_MAGIC_PREAMBLE);
    versions.forEach(function(version) {
        if (version instanceof Array) {
            var _a = version[0], major = _a.major, minor = _a.minor;
            var minMinor = version[1].minor;
            var range = minor - minMinor;
            handshakeBuffer.writeInt32(range << 16 | minor << 8 | major);
        } else {
            var major = version.major, minor = version.minor;
            handshakeBuffer.writeInt32(minor << 8 | major);
        }
    });
    handshakeBuffer.reset();
    return handshakeBuffer;
}
function parseNegotiatedResponse(buffer, log) {
    var h = [
        buffer.readUInt8(),
        buffer.readUInt8(),
        buffer.readUInt8(),
        buffer.readUInt8()
    ];
    if (h[0] === 0x48 && h[1] === 0x54 && h[2] === 0x54 && h[3] === 0x50) {
        log.error('Handshake failed since server responded with HTTP.');
        throw (0, neo4j_driver_core_1.newError)('Server responded HTTP. Make sure you are not trying to connect to the http endpoint ' + '(HTTP defaults to port 7474 whereas BOLT defaults to port 7687)');
    }
    return new neo4j_driver_core_1.ProtocolVersion(h[3], h[2]);
}
function handshakeNegotiationV2(channel, buffer, log) {
    var numVersions = buffer.readVarInt();
    var versions = [];
    for(var i = 0; i < numVersions; i++){
        var versionRange = [
            buffer.readUInt8(),
            buffer.readUInt8(),
            buffer.readUInt8(),
            buffer.readUInt8()
        ];
        versions = versions.concat(getVersions(versionRange));
    }
    var capabilityBitMask = buffer.readVarInt();
    var capabilites = selectCapabilites(capabilityBitMask);
    var major = 0;
    var minor = 0;
    versions.sort(function(a, b) {
        if (Number(a.major) !== Number(b.major)) {
            return Number(b.major) - Number(a.major);
        } else {
            return Number(b.minor) - Number(a.minor);
        }
    });
    for(var i = 0; i < versions.length; i++){
        var version_1 = versions[i];
        if (AVAILABLE_BOLT_PROTOCOLS.includes(version_1.major + '.' + version_1.minor)) {
            major = version_1.major;
            minor = version_1.minor;
            break;
        }
    }
    return new Promise(function(resolve, reject) {
        try {
            var selectionBuffer = (0, channel_1.alloc)(5);
            selectionBuffer.writeInt32(minor << 8 | major);
            selectionBuffer.writeVarInt(capabilites);
            channel.write(selectionBuffer);
            resolve({
                protocolVersion: new neo4j_driver_core_1.ProtocolVersion(major, minor),
                capabilites: capabilites,
                consumeRemainingBuffer: function(consumer) {
                    if (buffer.hasRemaining()) {
                        consumer(buffer.readSlice(buffer.remaining()));
                    }
                }
            });
        } catch (e) {
            reject(e);
        }
    });
}
/**
 * @return {BaseBuffer}
 * @private
 */ function newHandshakeBuffer() {
    return createHandshakeMessage([
        version(255, 1),
        [
            version(5, 8),
            version(5, 0)
        ],
        [
            version(4, 4),
            version(4, 2)
        ],
        version(3, 0)
    ]);
}
/**
 * This callback is displayed as a global member.
 * @callback BufferConsumerCallback
 * @param {buffer} buffer the remaining buffer
 */ /**
 * @typedef HandshakeResult
 * @property {ProtocolVersion} protocolVersion The protocol version negotiated in the handshake
 * @property {number} capabilites A bitmask representing the capabilities negotiated in the handshake
 * @property {function(BufferConsumerCallback)} consumeRemainingBuffer A function to consume the remaining buffer if it exists
 */ /**
 * Shake hands using the channel and return the protocol version
 *
 * @param {Channel} channel the channel use to shake hands
 * @param {Logger} log the log object
 * @returns {Promise<HandshakeResult>} Promise of protocol version and consumeRemainingBuffer
 */ function handshake(channel, log) {
    return initialHandshake(channel, log).then(function(result) {
        if (result.protocolVersion.isEqualTo(new neo4j_driver_core_1.ProtocolVersion(255, 1))) {
            return handshakeNegotiationV2(channel, result.buffer, log);
        } else {
            return result;
        }
    });
}
/**
 * Shake hands using the channel and return the protocol version, or the improved handshake protocol if communicating with a newer server.
 *
 * @param {Channel} channel the channel use to shake hands
 * @param {Logger} log the log object
 * @returns {Promise<HandshakeResult>} Promise of protocol version and consumeRemainingBuffer
 */ function initialHandshake(channel, log) {
    var _this = this;
    return new Promise(function(resolve, reject) {
        var handshakeErrorHandler = function(error) {
            reject(error);
        };
        channel.onerror = handshakeErrorHandler.bind(_this);
        if (channel._error) {
            handshakeErrorHandler(channel._error);
        }
        channel.onmessage = function(buffer) {
            try {
                // read the response buffer and initialize the protocol
                var protocolVersion = parseNegotiatedResponse(buffer, log);
                resolve({
                    protocolVersion: protocolVersion,
                    capabilites: 0,
                    buffer: buffer,
                    consumeRemainingBuffer: function(consumer) {
                        if (buffer.hasRemaining()) {
                            consumer(buffer.readSlice(buffer.remaining()));
                        }
                    }
                });
            } catch (e) {
                reject(e);
            }
        };
        channel.write(newHandshakeBuffer());
    });
}
function getVersions(versionArray) {
    var resultArr = [];
    var major = versionArray[3];
    var minor = versionArray[2];
    for(var i = 0; i <= versionArray[1]; i++){
        resultArr.push({
            major: major,
            minor: minor - i
        });
    }
    return resultArr;
}
function selectCapabilites(capabilityBitMask) {
    return DESIRED_CAPABILITES; // capabilites are currently unused and will always be 0.
}
}),
"[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/routing-table-raw.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
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
var __importDefault = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : {
        "default": mod
    };
};
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
 */ // eslint-disable-next-line no-unused-vars
var neo4j_driver_core_1 = __importDefault(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/index.js [app-route] (ecmascript)"));
/**
 * Represente the raw version of the routing table
 */ var RawRoutingTable = function() {
    function RawRoutingTable() {}
    /**
     * Constructs the raw routing table for Record based result
     * @param {Record} record The record which will be used get the raw routing table
     * @returns {RawRoutingTable} The raw routing table
     */ RawRoutingTable.ofRecord = function(record) {
        if (record === null) {
            return RawRoutingTable.ofNull();
        }
        return new RecordRawRoutingTable(record);
    };
    /**
     * Constructs the raw routing table for Success result for a Routing Message
     * @param {object} response The result
     * @returns {RawRoutingTable} The raw routing table
     */ RawRoutingTable.ofMessageResponse = function(response) {
        if (response === null) {
            return RawRoutingTable.ofNull();
        }
        return new ResponseRawRoutingTable(response);
    };
    /**
     * Construct the raw routing table of a null response
     *
     * @returns {RawRoutingTable} the raw routing table
     */ RawRoutingTable.ofNull = function() {
        return new NullRawRoutingTable();
    };
    Object.defineProperty(RawRoutingTable.prototype, "ttl", {
        /**
         * Get raw ttl
         *
         * @returns {number|string} ttl Time to live
         */ get: function() {
            throw new Error('Not implemented');
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RawRoutingTable.prototype, "db", {
        /**
         * Get raw db
         *
         * @returns {string?} The database name
         */ get: function() {
            throw new Error('Not implemented');
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RawRoutingTable.prototype, "servers", {
        /**
         *
         * @typedef {Object} ServerRole
         * @property {string} role the role of the address on the cluster
         * @property {string[]} addresses the address within the role
         *
         * @return {ServerRole[]} list of servers addresses
         */ get: function() {
            throw new Error('Not implemented');
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RawRoutingTable.prototype, "isNull", {
        /**
         * Indicates the result is null
         *
         * @returns {boolean} Is null
         */ get: function() {
            throw new Error('Not implemented');
        },
        enumerable: false,
        configurable: true
    });
    return RawRoutingTable;
}();
exports.default = RawRoutingTable;
/**
 * Get the raw routing table information from route message response
 */ var ResponseRawRoutingTable = function(_super) {
    __extends(ResponseRawRoutingTable, _super);
    function ResponseRawRoutingTable(response) {
        var _this = _super.call(this) || this;
        _this._response = response;
        return _this;
    }
    Object.defineProperty(ResponseRawRoutingTable.prototype, "ttl", {
        get: function() {
            return this._response.rt.ttl;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ResponseRawRoutingTable.prototype, "servers", {
        get: function() {
            return this._response.rt.servers;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ResponseRawRoutingTable.prototype, "db", {
        get: function() {
            return this._response.rt.db;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ResponseRawRoutingTable.prototype, "isNull", {
        get: function() {
            return this._response === null;
        },
        enumerable: false,
        configurable: true
    });
    return ResponseRawRoutingTable;
}(RawRoutingTable);
/**
 * Null routing table
 */ var NullRawRoutingTable = function(_super) {
    __extends(NullRawRoutingTable, _super);
    function NullRawRoutingTable() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(NullRawRoutingTable.prototype, "isNull", {
        get: function() {
            return true;
        },
        enumerable: false,
        configurable: true
    });
    return NullRawRoutingTable;
}(RawRoutingTable);
/**
 * Get the raw routing table information from the record
 */ var RecordRawRoutingTable = function(_super) {
    __extends(RecordRawRoutingTable, _super);
    function RecordRawRoutingTable(record) {
        var _this = _super.call(this) || this;
        _this._record = record;
        return _this;
    }
    Object.defineProperty(RecordRawRoutingTable.prototype, "ttl", {
        get: function() {
            return this._record.get('ttl');
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RecordRawRoutingTable.prototype, "servers", {
        get: function() {
            return this._record.get('servers');
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RecordRawRoutingTable.prototype, "db", {
        get: function() {
            return this._record.has('db') ? this._record.get('db') : null;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(RecordRawRoutingTable.prototype, "isNull", {
        get: function() {
            return this._record === null;
        },
        enumerable: false,
        configurable: true
    });
    return RecordRawRoutingTable;
}(RawRoutingTable);
}),
"[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/lang/functional.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
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
exports.identity = identity;
exports.reuseOngoingRequest = reuseOngoingRequest;
var neo4j_driver_core_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/index.js [app-route] (ecmascript)");
/**
 * Identity function.
 *
 * Identity functions are function which returns the input as output.
 *
 * @param {any} x
 * @returns {any} the x
 */ function identity(x) {
    return x;
}
/**
 * Makes the function able to share ongoing requests
 *
 * @param {function(...args): Promise} func The function to be decorated
 * @param {any} thisArg The `this` which should be used in the function call
 * @return {function(...args): Promise} The decorated function
 */ function reuseOngoingRequest(func, thisArg) {
    if (thisArg === void 0) {
        thisArg = null;
    }
    var ongoingRequests = new Map();
    return function() {
        var args = [];
        for(var _i = 0; _i < arguments.length; _i++){
            args[_i] = arguments[_i];
        }
        var key = neo4j_driver_core_1.json.stringify(args);
        if (ongoingRequests.has(key)) {
            return ongoingRequests.get(key);
        }
        var promise = func.apply(thisArg, args);
        ongoingRequests.set(key, promise);
        return promise.finally(function() {
            ongoingRequests.delete(key);
        });
    };
}
}),
"[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/lang/object.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
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
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.equals = equals;
function equals(a, b) {
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
                if (a[key] !== b[key]) {
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
}),
"[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/lang/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
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
exports.object = exports.functional = void 0;
exports.functional = __importStar(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/lang/functional.js [app-route] (ecmascript)"));
exports.object = __importStar(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/lang/object.js [app-route] (ecmascript)"));
}),
"[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/stream-observers.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
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
var __importDefault = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : {
        "default": mod
    };
};
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.TelemetryObserver = exports.ProcedureRouteObserver = exports.RouteObserver = exports.CompletedObserver = exports.FailedObserver = exports.ResetObserver = exports.LogoffObserver = exports.LoginObserver = exports.ResultStreamObserver = exports.StreamObserver = void 0;
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
 */ var neo4j_driver_core_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/index.js [app-route] (ecmascript)");
var routing_table_raw_1 = __importDefault(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/routing-table-raw.js [app-route] (ecmascript)"));
var lang_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/lang/index.js [app-route] (ecmascript)");
var FETCH_ALL = neo4j_driver_core_1.internal.constants.FETCH_ALL;
var PROTOCOL_ERROR = neo4j_driver_core_1.error.PROTOCOL_ERROR;
var StreamObserver = function() {
    function StreamObserver() {}
    StreamObserver.prototype.onNext = function(rawRecord) {};
    StreamObserver.prototype.onError = function(_error) {};
    StreamObserver.prototype.onCompleted = function(meta) {};
    return StreamObserver;
}();
exports.StreamObserver = StreamObserver;
/**
 * Handles a RUN/PULL_ALL, or RUN/DISCARD_ALL requests, maps the responses
 * in a way that a user-provided observer can see these as a clean Stream
 * of records.
 * This class will queue up incoming messages until a user-provided observer
 * for the incoming stream is registered. Thus, we keep fields around
 * for tracking head/records/tail. These are only used if there is no
 * observer registered.
 * @access private
 */ var ResultStreamObserver = function(_super) {
    __extends(ResultStreamObserver, _super);
    /**
     *
     * @param {Object} param
     * @param {Object} param.server
     * @param {boolean} param.reactive
     * @param {function(stmtId: number|Integer, n: number|Integer, observer: StreamObserver)} param.moreFunction -
     * @param {function(stmtId: number|Integer, observer: StreamObserver)} param.discardFunction -
     * @param {number|Integer} param.fetchSize -
     * @param {function(err: Error): Promise|void} param.beforeError -
     * @param {function(err: Error): Promise|void} param.afterError -
     * @param {function(keys: string[]): Promise|void} param.beforeKeys -
     * @param {function(keys: string[]): Promise|void} param.afterKeys -
     * @param {function(metadata: Object): Promise|void} param.beforeComplete -
     * @param {function(metadata: Object): Promise|void} param.afterComplete -
     * @param {function(metadata: Object): Promise|void} param.enrichMetadata -
     */ function ResultStreamObserver(_a) {
        var _b = _a === void 0 ? {} : _a, _c = _b.reactive, reactive = _c === void 0 ? false : _c, moreFunction = _b.moreFunction, discardFunction = _b.discardFunction, _d = _b.fetchSize, fetchSize = _d === void 0 ? FETCH_ALL : _d, beforeError = _b.beforeError, afterError = _b.afterError, beforeKeys = _b.beforeKeys, afterKeys = _b.afterKeys, beforeComplete = _b.beforeComplete, afterComplete = _b.afterComplete, server = _b.server, _e = _b.highRecordWatermark, highRecordWatermark = _e === void 0 ? Number.MAX_VALUE : _e, _f = _b.lowRecordWatermark, lowRecordWatermark = _f === void 0 ? Number.MAX_VALUE : _f, enrichMetadata = _b.enrichMetadata, onDb = _b.onDb;
        var _this = _super.call(this) || this;
        _this._fieldKeys = null;
        _this._fieldLookup = null;
        _this._head = null;
        _this._queuedRecords = [];
        _this._tail = null;
        _this._error = null;
        _this._observers = [];
        _this._meta = {};
        _this._server = server;
        _this._beforeError = beforeError;
        _this._afterError = afterError;
        _this._beforeKeys = beforeKeys;
        _this._afterKeys = afterKeys;
        _this._beforeComplete = beforeComplete;
        _this._afterComplete = afterComplete;
        _this._enrichMetadata = enrichMetadata || lang_1.functional.identity;
        _this._queryId = null;
        _this._moreFunction = moreFunction;
        _this._discardFunction = discardFunction;
        _this._discard = false;
        _this._fetchSize = fetchSize;
        _this._lowRecordWatermark = lowRecordWatermark;
        _this._highRecordWatermark = highRecordWatermark;
        _this._setState(reactive ? _states.READY : _states.READY_STREAMING);
        _this._setupAutoPull();
        _this._paused = false;
        _this._pulled = !reactive;
        _this._haveRecordStreamed = false;
        _this._onDb = onDb;
        return _this;
    }
    /**
     * Pause the record consuming
     *
     * This function will supend the record consuming. It will not cancel the stream and the already
     * requested records will be sent to the subscriber.
     */ ResultStreamObserver.prototype.pause = function() {
        this._paused = true;
    };
    /**
     * Resume the record consuming
     *
     * This function will resume the record consuming fetching more records from the server.
     */ ResultStreamObserver.prototype.resume = function() {
        this._paused = false;
        this._setupAutoPull(true);
        this._state.pull(this);
    };
    /**
     * Will be called on every record that comes in and transform a raw record
     * to a Object. If user-provided observer is present, pass transformed record
     * to it's onNext method, otherwise, push to record que.
     * @param {Array} rawRecord - An array with the raw record
     */ ResultStreamObserver.prototype.onNext = function(rawRecord) {
        this._haveRecordStreamed = true;
        var record = new neo4j_driver_core_1.Record(this._fieldKeys, rawRecord, this._fieldLookup);
        if (this._observers.some(function(o) {
            return o.onNext;
        })) {
            this._observers.forEach(function(o) {
                if (o.onNext) {
                    o.onNext(record);
                }
            });
        } else {
            this._queuedRecords.push(record);
            if (this._queuedRecords.length > this._highRecordWatermark) {
                this._autoPull = false;
            }
        }
    };
    ResultStreamObserver.prototype.onCompleted = function(meta) {
        this._state.onSuccess(this, meta);
    };
    /**
     * Will be called on errors.
     * If user-provided observer is present, pass the error
     * to it's onError method, otherwise set instance variable _error.
     * @param {Object} error - An error object
     */ ResultStreamObserver.prototype.onError = function(error) {
        this._state.onError(this, error);
    };
    /**
     * Cancel pending record stream
     */ ResultStreamObserver.prototype.cancel = function() {
        this._discard = true;
    };
    /**
     * Stream observer defaults to handling responses for two messages: RUN + PULL_ALL or RUN + DISCARD_ALL.
     * Response for RUN initializes query keys. Response for PULL_ALL / DISCARD_ALL exposes the result stream.
     *
     * However, some operations can be represented as a single message which receives full metadata in a single response.
     * For example, operations to begin, commit and rollback an explicit transaction use two messages in Bolt V1 but a single message in Bolt V3.
     * Messages are `RUN "BEGIN" {}` + `PULL_ALL` in Bolt V1 and `BEGIN` in Bolt V3.
     *
     * This function prepares the observer to only handle a single response message.
     */ ResultStreamObserver.prototype.prepareToHandleSingleResponse = function() {
        this._head = [];
        this._fieldKeys = [];
        this._setState(_states.STREAMING);
    };
    /**
     * Mark this observer as if it has completed with no metadata.
     */ ResultStreamObserver.prototype.markCompleted = function() {
        this._head = [];
        this._fieldKeys = [];
        this._tail = {};
        this._setState(_states.SUCCEEDED);
    };
    /**
     * Subscribe to events with provided observer.
     * @param {Object} observer - Observer object
     * @param {function(keys: String[])} observer.onKeys - Handle stream header, field keys.
     * @param {function(record: Object)} observer.onNext - Handle records, one by one.
     * @param {function(metadata: Object)} observer.onCompleted - Handle stream tail, the metadata.
     * @param {function(error: Object)} observer.onError - Handle errors, should always be provided.
     */ ResultStreamObserver.prototype.subscribe = function(observer) {
        if (this._head && observer.onKeys) {
            observer.onKeys(this._head);
        }
        if (this._queuedRecords.length > 0 && observer.onNext) {
            for(var i = 0; i < this._queuedRecords.length; i++){
                observer.onNext(this._queuedRecords[i]);
                if (this._queuedRecords.length - i - 1 <= this._lowRecordWatermark) {
                    this._autoPull = true;
                    if (this._state === _states.READY) {
                        this._handleStreaming();
                    }
                }
            }
        }
        if (this._tail && observer.onCompleted) {
            observer.onCompleted(this._tail);
        }
        if (this._error) {
            observer.onError(this._error);
        }
        this._observers.push(observer);
        if (this._state === _states.READY) {
            this._handleStreaming();
        }
    };
    ResultStreamObserver.prototype._handleHasMore = function(meta) {
        // We've consumed current batch and server notified us that there're more
        // records to stream. Let's invoke more or discard function based on whether
        // the user wants to discard streaming or not
        this._setState(_states.READY); // we've done streaming
        this._handleStreaming();
        delete meta.has_more;
    };
    ResultStreamObserver.prototype._handlePullSuccess = function(meta) {
        var _this = this;
        var completionMetadata = this._enrichMetadata(Object.assign(this._server ? {
            server: this._server
        } : {}, this._meta, {
            stream_summary: {
                have_records_streamed: this._haveRecordStreamed,
                pulled: this._pulled,
                has_keys: this._fieldKeys.length > 0
            }
        }, meta));
        if (![
            undefined,
            null,
            'r',
            'w',
            'rw',
            's'
        ].includes(completionMetadata.type)) {
            this.onError((0, neo4j_driver_core_1.newError)("Server returned invalid query type. Expected one of [undefined, null, \"r\", \"w\", \"rw\", \"s\"] but got '".concat(completionMetadata.type, "'"), PROTOCOL_ERROR));
            return;
        }
        this._setState(_states.SUCCEEDED);
        var beforeHandlerResult = null;
        if (this._beforeComplete) {
            beforeHandlerResult = this._beforeComplete(completionMetadata);
        }
        var continuation = function() {
            // End of stream
            _this._tail = completionMetadata;
            if (_this._observers.some(function(o) {
                return o.onCompleted;
            })) {
                _this._observers.forEach(function(o) {
                    if (o.onCompleted) {
                        o.onCompleted(completionMetadata);
                    }
                });
            }
            if (_this._afterComplete) {
                _this._afterComplete(completionMetadata);
            }
        };
        if (beforeHandlerResult) {
            Promise.resolve(beforeHandlerResult).then(function() {
                return continuation();
            });
        } else {
            continuation();
        }
    };
    ResultStreamObserver.prototype._handleRunSuccess = function(meta, afterSuccess) {
        var _this = this;
        if (this._fieldKeys === null) {
            // Stream header, build a name->index field lookup table
            // to be used by records. This is an optimization to make it
            // faster to look up fields in a record by name, rather than by index.
            // Since the records we get back via Bolt are just arrays of values.
            this._fieldKeys = [];
            this._fieldLookup = {};
            if (meta.fields && meta.fields.length > 0) {
                this._fieldKeys = meta.fields;
                for(var i = 0; i < meta.fields.length; i++){
                    this._fieldLookup[meta.fields[i]] = i;
                }
            }
            if (meta.db !== null && this._onDb !== undefined) {
                this._onDb(meta.db);
            }
            if (meta.fields != null) {
                // remove fields key from metadata object
                delete meta.fields;
            }
            // Extract server generated query id for use in requestMore and discard
            // functions
            if (meta.qid !== null && meta.qid !== undefined) {
                this._queryId = meta.qid;
                // remove qid from metadata object
                delete meta.qid;
            }
            this._storeMetadataForCompletion(meta);
            var beforeHandlerResult = null;
            if (this._beforeKeys) {
                beforeHandlerResult = this._beforeKeys(this._fieldKeys);
            }
            var continuation_1 = function() {
                _this._head = _this._fieldKeys;
                if (_this._observers.some(function(o) {
                    return o.onKeys;
                })) {
                    _this._observers.forEach(function(o) {
                        if (o.onKeys) {
                            o.onKeys(_this._fieldKeys);
                        }
                    });
                }
                if (_this._afterKeys) {
                    _this._afterKeys(_this._fieldKeys);
                }
                afterSuccess();
            };
            if (beforeHandlerResult) {
                Promise.resolve(beforeHandlerResult).then(function() {
                    return continuation_1();
                });
            } else {
                continuation_1();
            }
        }
    };
    ResultStreamObserver.prototype._handleError = function(error) {
        var _this = this;
        this._setState(_states.FAILED);
        this._error = error;
        var beforeHandlerResult = null;
        if (this._beforeError) {
            beforeHandlerResult = this._beforeError(error);
        }
        var continuation = function() {
            if (_this._observers.some(function(o) {
                return o.onError;
            })) {
                _this._observers.forEach(function(o) {
                    if (o.onError) {
                        o.onError(error);
                    }
                });
            }
            if (_this._afterError) {
                _this._afterError(error);
            }
        };
        if (beforeHandlerResult) {
            Promise.resolve(beforeHandlerResult).then(function() {
                return continuation();
            });
        } else {
            continuation();
        }
    };
    ResultStreamObserver.prototype._handleStreaming = function() {
        if (this._head && this._observers.some(function(o) {
            return o.onNext || o.onCompleted;
        })) {
            if (!this._paused && (this._discard || this._autoPull)) {
                this._more();
            }
        }
    };
    ResultStreamObserver.prototype._more = function() {
        if (this._discard) {
            this._discardFunction(this._queryId, this);
        } else {
            this._pulled = true;
            this._moreFunction(this._queryId, this._fetchSize, this);
        }
        this._setState(_states.STREAMING);
    };
    ResultStreamObserver.prototype._storeMetadataForCompletion = function(meta) {
        var keys = Object.keys(meta);
        var index = keys.length;
        var key = '';
        while(index--){
            key = keys[index];
            this._meta[key] = meta[key];
        }
    };
    ResultStreamObserver.prototype._setState = function(state) {
        this._state = state;
    };
    ResultStreamObserver.prototype._setupAutoPull = function() {
        this._autoPull = true;
    };
    return ResultStreamObserver;
}(StreamObserver);
exports.ResultStreamObserver = ResultStreamObserver;
var LoginObserver = function(_super) {
    __extends(LoginObserver, _super);
    /**
     *
     * @param {Object} param -
     * @param {function(err: Error)} param.onError
     * @param {function(metadata)} param.onCompleted
     */ function LoginObserver(_a) {
        var _b = _a === void 0 ? {} : _a, onError = _b.onError, onCompleted = _b.onCompleted;
        var _this = _super.call(this) || this;
        _this._onError = onError;
        _this._onCompleted = onCompleted;
        return _this;
    }
    LoginObserver.prototype.onNext = function(record) {
        this.onError((0, neo4j_driver_core_1.newError)('Received RECORD when initializing ' + neo4j_driver_core_1.json.stringify(record)));
    };
    LoginObserver.prototype.onError = function(error) {
        if (this._onError) {
            this._onError(error);
        }
    };
    LoginObserver.prototype.onCompleted = function(metadata) {
        if (this._onCompleted) {
            this._onCompleted(metadata);
        }
    };
    return LoginObserver;
}(StreamObserver);
exports.LoginObserver = LoginObserver;
var LogoffObserver = function(_super) {
    __extends(LogoffObserver, _super);
    /**
     *
     * @param {Object} param -
     * @param {function(err: Error)} param.onError
     * @param {function(metadata)} param.onCompleted
     */ function LogoffObserver(_a) {
        var _b = _a === void 0 ? {} : _a, onError = _b.onError, onCompleted = _b.onCompleted;
        var _this = _super.call(this) || this;
        _this._onError = onError;
        _this._onCompleted = onCompleted;
        return _this;
    }
    LogoffObserver.prototype.onNext = function(record) {
        this.onError((0, neo4j_driver_core_1.newError)('Received RECORD when logging off ' + neo4j_driver_core_1.json.stringify(record)));
    };
    LogoffObserver.prototype.onError = function(error) {
        if (this._onError) {
            this._onError(error);
        }
    };
    LogoffObserver.prototype.onCompleted = function(metadata) {
        if (this._onCompleted) {
            this._onCompleted(metadata);
        }
    };
    return LogoffObserver;
}(StreamObserver);
exports.LogoffObserver = LogoffObserver;
var ResetObserver = function(_super) {
    __extends(ResetObserver, _super);
    /**
     *
     * @param {Object} param -
     * @param {function(err: String)} param.onProtocolError
     * @param {function(err: Error)} param.onError
     * @param {function(metadata)} param.onComplete
     */ function ResetObserver(_a) {
        var _b = _a === void 0 ? {} : _a, onProtocolError = _b.onProtocolError, onError = _b.onError, onComplete = _b.onComplete;
        var _this = _super.call(this) || this;
        _this._onProtocolError = onProtocolError;
        _this._onError = onError;
        _this._onComplete = onComplete;
        return _this;
    }
    ResetObserver.prototype.onNext = function(record) {
        this.onError((0, neo4j_driver_core_1.newError)('Received RECORD when resetting: received record is: ' + neo4j_driver_core_1.json.stringify(record), PROTOCOL_ERROR));
    };
    ResetObserver.prototype.onError = function(error) {
        if (error.code === PROTOCOL_ERROR && this._onProtocolError) {
            this._onProtocolError(error.message);
        }
        if (this._onError) {
            this._onError(error);
        }
    };
    ResetObserver.prototype.onCompleted = function(metadata) {
        if (this._onComplete) {
            this._onComplete(metadata);
        }
    };
    return ResetObserver;
}(StreamObserver);
exports.ResetObserver = ResetObserver;
var TelemetryObserver = function(_super) {
    __extends(TelemetryObserver, _super);
    /**
     *
     * @param {Object} param -
     * @param {function(err: Error)} param.onError
     * @param {function(metadata)} param.onCompleted
     */ function TelemetryObserver(_a) {
        var _b = _a === void 0 ? {} : _a, onError = _b.onError, onCompleted = _b.onCompleted;
        var _this = _super.call(this) || this;
        _this._onError = onError;
        _this._onCompleted = onCompleted;
        return _this;
    }
    TelemetryObserver.prototype.onNext = function(record) {
        this.onError((0, neo4j_driver_core_1.newError)('Received RECORD when sending telemetry ' + neo4j_driver_core_1.json.stringify(record), PROTOCOL_ERROR));
    };
    TelemetryObserver.prototype.onError = function(error) {
        if (this._onError) {
            this._onError(error);
        }
    };
    TelemetryObserver.prototype.onCompleted = function(metadata) {
        if (this._onCompleted) {
            this._onCompleted(metadata);
        }
    };
    return TelemetryObserver;
}(ResultStreamObserver);
exports.TelemetryObserver = TelemetryObserver;
var FailedObserver = function(_super) {
    __extends(FailedObserver, _super);
    function FailedObserver(_a) {
        var error = _a.error, onError = _a.onError;
        var _this = _super.call(this, {
            beforeError: onError
        }) || this;
        _this.onError(error);
        return _this;
    }
    return FailedObserver;
}(ResultStreamObserver);
exports.FailedObserver = FailedObserver;
var CompletedObserver = function(_super) {
    __extends(CompletedObserver, _super);
    function CompletedObserver() {
        var _this = _super.call(this) || this;
        _super.prototype.markCompleted.call(_this);
        return _this;
    }
    return CompletedObserver;
}(ResultStreamObserver);
exports.CompletedObserver = CompletedObserver;
var ProcedureRouteObserver = function(_super) {
    __extends(ProcedureRouteObserver, _super);
    function ProcedureRouteObserver(_a) {
        var resultObserver = _a.resultObserver, onProtocolError = _a.onProtocolError, onError = _a.onError, onCompleted = _a.onCompleted;
        var _this = _super.call(this) || this;
        _this._resultObserver = resultObserver;
        _this._onError = onError;
        _this._onCompleted = onCompleted;
        _this._records = [];
        _this._onProtocolError = onProtocolError;
        resultObserver.subscribe(_this);
        return _this;
    }
    ProcedureRouteObserver.prototype.onNext = function(record) {
        this._records.push(record);
    };
    ProcedureRouteObserver.prototype.onError = function(error) {
        if (error.code === PROTOCOL_ERROR && this._onProtocolError) {
            this._onProtocolError(error.message);
        }
        if (this._onError) {
            this._onError(error);
        }
    };
    ProcedureRouteObserver.prototype.onCompleted = function() {
        if (this._records !== null && this._records.length !== 1) {
            this.onError((0, neo4j_driver_core_1.newError)('Illegal response from router. Received ' + this._records.length + ' records but expected only one.\n' + neo4j_driver_core_1.json.stringify(this._records), PROTOCOL_ERROR));
            return;
        }
        if (this._onCompleted) {
            this._onCompleted(routing_table_raw_1.default.ofRecord(this._records[0]));
        }
    };
    return ProcedureRouteObserver;
}(StreamObserver);
exports.ProcedureRouteObserver = ProcedureRouteObserver;
var RouteObserver = function(_super) {
    __extends(RouteObserver, _super);
    /**
     *
     * @param {Object} param -
     * @param {function(err: String)} param.onProtocolError
     * @param {function(err: Error)} param.onError
     * @param {function(RawRoutingTable)} param.onCompleted
     */ function RouteObserver(_a) {
        var _b = _a === void 0 ? {} : _a, onProtocolError = _b.onProtocolError, onError = _b.onError, onCompleted = _b.onCompleted;
        var _this = _super.call(this) || this;
        _this._onProtocolError = onProtocolError;
        _this._onError = onError;
        _this._onCompleted = onCompleted;
        return _this;
    }
    RouteObserver.prototype.onNext = function(record) {
        this.onError((0, neo4j_driver_core_1.newError)('Received RECORD when resetting: received record is: ' + neo4j_driver_core_1.json.stringify(record), PROTOCOL_ERROR));
    };
    RouteObserver.prototype.onError = function(error) {
        if (error.code === PROTOCOL_ERROR && this._onProtocolError) {
            this._onProtocolError(error.message);
        }
        if (this._onError) {
            this._onError(error);
        }
    };
    RouteObserver.prototype.onCompleted = function(metadata) {
        if (this._onCompleted) {
            this._onCompleted(routing_table_raw_1.default.ofMessageResponse(metadata));
        }
    };
    return RouteObserver;
}(StreamObserver);
exports.RouteObserver = RouteObserver;
var _states = {
    READY_STREAMING: {
        // async start state
        onSuccess: function(streamObserver, meta) {
            streamObserver._handleRunSuccess(meta, function() {
                streamObserver._setState(_states.STREAMING);
            } // after run succeeded, async directly move to streaming
            );
        },
        onError: function(streamObserver, error) {
            streamObserver._handleError(error);
        },
        name: function() {
            return 'READY_STREAMING';
        },
        pull: function() {}
    },
    READY: {
        // reactive start state
        onSuccess: function(streamObserver, meta) {
            streamObserver._handleRunSuccess(meta, function() {
                return streamObserver._handleStreaming();
            } // after run succeeded received, reactive shall start pulling
            );
        },
        onError: function(streamObserver, error) {
            streamObserver._handleError(error);
        },
        name: function() {
            return 'READY';
        },
        pull: function(streamObserver) {
            return streamObserver._more();
        }
    },
    STREAMING: {
        onSuccess: function(streamObserver, meta) {
            if (meta.has_more) {
                streamObserver._handleHasMore(meta);
            } else {
                streamObserver._handlePullSuccess(meta);
            }
        },
        onError: function(streamObserver, error) {
            streamObserver._handleError(error);
        },
        name: function() {
            return 'STREAMING';
        },
        pull: function() {}
    },
    FAILED: {
        onError: function(_error) {
        // more errors are ignored
        },
        name: function() {
            return 'FAILED';
        },
        pull: function() {}
    },
    SUCCEEDED: {
        name: function() {
            return 'SUCCEEDED';
        },
        pull: function() {}
    }
};
}),
"[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/bolt-protocol-util.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.assertDatabaseIsEmpty = assertDatabaseIsEmpty;
exports.assertTxConfigIsEmpty = assertTxConfigIsEmpty;
exports.assertImpersonatedUserIsEmpty = assertImpersonatedUserIsEmpty;
exports.assertNotificationFilterIsEmpty = assertNotificationFilterIsEmpty;
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
 */ var neo4j_driver_core_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/index.js [app-route] (ecmascript)");
// eslint-disable-next-line no-unused-vars
var stream_observers_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/stream-observers.js [app-route] (ecmascript)");
/**
 * @param {TxConfig} txConfig the auto-commit transaction configuration.
 * @param {function(error: string)} onProtocolError called when the txConfig is not empty.
 * @param {ResultStreamObserver} observer the response observer.
 */ function assertTxConfigIsEmpty(txConfig, onProtocolError, observer) {
    if (onProtocolError === void 0) {
        onProtocolError = function() {};
    }
    if (txConfig && !txConfig.isEmpty()) {
        var error = (0, neo4j_driver_core_1.newError)('Driver is connected to the database that does not support transaction configuration. ' + 'Please upgrade to neo4j 3.5.0 or later in order to use this functionality');
        // unsupported API was used, consider this a fatal error for the current connection
        onProtocolError(error.message);
        observer.onError(error);
        throw error;
    }
}
/**
 * Asserts that the passed-in database name is empty.
 * @param {string} database
 * @param {fuction(err: String)} onProtocolError Called when it doesn't have database set
 */ function assertDatabaseIsEmpty(database, onProtocolError, observer) {
    if (onProtocolError === void 0) {
        onProtocolError = function() {};
    }
    if (database) {
        var error = (0, neo4j_driver_core_1.newError)('Driver is connected to the database that does not support multiple databases. ' + 'Please upgrade to neo4j 4.0.0 or later in order to use this functionality');
        // unsupported API was used, consider this a fatal error for the current connection
        onProtocolError(error.message);
        observer.onError(error);
        throw error;
    }
}
/**
 * Asserts that the passed-in impersonated user is empty
 * @param {string} impersonatedUser
 * @param {function (err:Error)} onProtocolError Called when it does have impersonated user set
 * @param {any} observer
 */ function assertImpersonatedUserIsEmpty(impersonatedUser, onProtocolError, observer) {
    if (onProtocolError === void 0) {
        onProtocolError = function() {};
    }
    if (impersonatedUser) {
        var error = (0, neo4j_driver_core_1.newError)('Driver is connected to the database that does not support user impersonation. ' + 'Please upgrade to neo4j 4.4.0 or later in order to use this functionality. ' + "Trying to impersonate ".concat(impersonatedUser, "."));
        // unsupported API was used, consider this a fatal error for the current connection
        onProtocolError(error.message);
        observer.onError(error);
        throw error;
    }
}
/**
 * Asserts that the passed-in notificationFilter is empty
 * @param {NotificationFilter} notificationFilter
 * @param {function (err:Error)} onProtocolError Called when it does have notificationFilter user set
 * @param {any} observer
 */ function assertNotificationFilterIsEmpty(notificationFilter, onProtocolError, observer) {
    if (onProtocolError === void 0) {
        onProtocolError = function() {};
    }
    if (notificationFilter !== undefined) {
        var error = (0, neo4j_driver_core_1.newError)('Driver is connected to a database that does not support user notification filters. ' + 'Please upgrade to Neo4j 5.7.0 or later in order to use this functionality. ' + "Trying to set notifications to ".concat(neo4j_driver_core_1.json.stringify(notificationFilter), "."));
        // unsupported API was used, consider this a fatal error for the current connection
        onProtocolError(error.message);
        observer.onError(error);
        throw error;
    }
}
}),
"[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/packstream/structure.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
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
exports.Structure = void 0;
exports.verifyStructSize = verifyStructSize;
var neo4j_driver_core_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/index.js [app-route] (ecmascript)");
var PROTOCOL_ERROR = neo4j_driver_core_1.error.PROTOCOL_ERROR;
/**
 * A Structure have a signature and fields.
 */ var Structure = function() {
    /**
     * Create new instance
     */ function Structure(signature, fields) {
        this.signature = signature;
        this.fields = fields;
    }
    Object.defineProperty(Structure.prototype, "size", {
        get: function() {
            return this.fields.length;
        },
        enumerable: false,
        configurable: true
    });
    Structure.prototype.toString = function() {
        var fieldStr = '';
        for(var i = 0; i < this.fields.length; i++){
            if (i > 0) {
                fieldStr += ', ';
            }
            fieldStr += this.fields[i];
        }
        return 'Structure(' + this.signature + ', [' + fieldStr + '])';
    };
    return Structure;
}();
exports.Structure = Structure;
function verifyStructSize(structName, expectedSize, actualSize) {
    if (expectedSize !== actualSize) {
        throw (0, neo4j_driver_core_1.newError)("Wrong struct size for ".concat(structName, ", expected ").concat(expectedSize, " but was ").concat(actualSize), PROTOCOL_ERROR);
    }
}
exports.default = Structure;
}),
"[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/packstream/packstream-v1.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Unpacker = exports.Packer = void 0;
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
 */ var channel_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/channel/index.js [app-route] (ecmascript)");
var lang_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/lang/index.js [app-route] (ecmascript)");
var structure_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/packstream/structure.js [app-route] (ecmascript)");
var neo4j_driver_core_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/index.js [app-route] (ecmascript)");
var PROTOCOL_ERROR = neo4j_driver_core_1.error.PROTOCOL_ERROR;
var TINY_STRING = 0x80;
var TINY_LIST = 0x90;
var TINY_MAP = 0xa0;
var TINY_STRUCT = 0xb0;
var NULL = 0xc0;
var FLOAT_64 = 0xc1;
var FALSE = 0xc2;
var TRUE = 0xc3;
var INT_8 = 0xc8;
var INT_16 = 0xc9;
var INT_32 = 0xca;
var INT_64 = 0xcb;
var STRING_8 = 0xd0;
var STRING_16 = 0xd1;
var STRING_32 = 0xd2;
var LIST_8 = 0xd4;
var LIST_16 = 0xd5;
var LIST_32 = 0xd6;
var BYTES_8 = 0xcc;
var BYTES_16 = 0xcd;
var BYTES_32 = 0xce;
var MAP_8 = 0xd8;
var MAP_16 = 0xd9;
var MAP_32 = 0xda;
var STRUCT_8 = 0xdc;
var STRUCT_16 = 0xdd;
/**
 * Class to pack
 * @access private
 */ var Packer = function() {
    /**
     * @constructor
     * @param {Chunker} channel the chunker backed by a network channel.
     */ function Packer(channel) {
        this._ch = channel;
        this._byteArraysSupported = true;
    }
    /**
     * Creates a packable function out of the provided value
     * @param x the value to pack
     * @returns Function
     */ Packer.prototype.packable = function(x, dehydrateStruct) {
        var _this = this;
        if (dehydrateStruct === void 0) {
            dehydrateStruct = lang_1.functional.identity;
        }
        try {
            x = dehydrateStruct(x);
        } catch (ex) {
            return function() {
                throw ex;
            };
        }
        if (x === null) {
            return function() {
                return _this._ch.writeUInt8(NULL);
            };
        } else if (x === true) {
            return function() {
                return _this._ch.writeUInt8(TRUE);
            };
        } else if (x === false) {
            return function() {
                return _this._ch.writeUInt8(FALSE);
            };
        } else if (typeof x === 'number') {
            return function() {
                return _this.packFloat(x);
            };
        } else if (typeof x === 'string') {
            return function() {
                return _this.packString(x);
            };
        } else if (typeof x === 'bigint') {
            return function() {
                return _this.packInteger((0, neo4j_driver_core_1.int)(x));
            };
        } else if ((0, neo4j_driver_core_1.isInt)(x)) {
            return function() {
                return _this.packInteger(x);
            };
        } else if (x instanceof Int8Array) {
            return function() {
                return _this.packBytes(x);
            };
        } else if (x instanceof Array) {
            return function() {
                _this.packListHeader(x.length);
                for(var i = 0; i < x.length; i++){
                    _this.packable(x[i] === undefined ? null : x[i], dehydrateStruct)();
                }
            };
        } else if (isIterable(x)) {
            return this.packableIterable(x, dehydrateStruct);
        } else if (x instanceof structure_1.Structure) {
            var packableFields_1 = [];
            for(var i = 0; i < x.fields.length; i++){
                packableFields_1[i] = this.packable(x.fields[i], dehydrateStruct);
            }
            return function() {
                return _this.packStruct(x.signature, packableFields_1);
            };
        } else if (typeof x === 'object') {
            return function() {
                var keys = Object.keys(x);
                var count = 0;
                for(var i = 0; i < keys.length; i++){
                    if (x[keys[i]] !== undefined) {
                        count++;
                    }
                }
                _this.packMapHeader(count);
                for(var i = 0; i < keys.length; i++){
                    var key = keys[i];
                    if (x[key] !== undefined) {
                        _this.packString(key);
                        _this.packable(x[key], dehydrateStruct)();
                    }
                }
            };
        } else {
            return this._nonPackableValue("Unable to pack the given value: ".concat(x));
        }
    };
    Packer.prototype.packableIterable = function(iterable, dehydrateStruct) {
        try {
            var array = Array.from(iterable);
            return this.packable(array, dehydrateStruct);
        } catch (e) {
            // handle errors from iterable to array conversion
            throw (0, neo4j_driver_core_1.newError)("Cannot pack given iterable, ".concat(e.message, ": ").concat(iterable));
        }
    };
    /**
     * Packs a struct
     * @param signature the signature of the struct
     * @param packableFields the fields of the struct, make sure you call `packable on all fields`
     */ Packer.prototype.packStruct = function(signature, packableFields) {
        packableFields = packableFields || [];
        this.packStructHeader(packableFields.length, signature);
        for(var i = 0; i < packableFields.length; i++){
            packableFields[i]();
        }
    };
    Packer.prototype.packInteger = function(x) {
        var high = x.high;
        var low = x.low;
        if (x.greaterThanOrEqual(-0x10) && x.lessThan(0x80)) {
            this._ch.writeInt8(low);
        } else if (x.greaterThanOrEqual(-0x80) && x.lessThan(-0x10)) {
            this._ch.writeUInt8(INT_8);
            this._ch.writeInt8(low);
        } else if (x.greaterThanOrEqual(-0x8000) && x.lessThan(0x8000)) {
            this._ch.writeUInt8(INT_16);
            this._ch.writeInt16(low);
        } else if (x.greaterThanOrEqual(-0x80000000) && x.lessThan(0x80000000)) {
            this._ch.writeUInt8(INT_32);
            this._ch.writeInt32(low);
        } else {
            this._ch.writeUInt8(INT_64);
            this._ch.writeInt32(high);
            this._ch.writeInt32(low);
        }
    };
    Packer.prototype.packFloat = function(x) {
        this._ch.writeUInt8(FLOAT_64);
        this._ch.writeFloat64(x);
    };
    Packer.prototype.packString = function(x) {
        var bytes = channel_1.utf8.encode(x);
        var size = bytes.length;
        if (size < 0x10) {
            this._ch.writeUInt8(TINY_STRING | size);
            this._ch.writeBytes(bytes);
        } else if (size < 0x100) {
            this._ch.writeUInt8(STRING_8);
            this._ch.writeUInt8(size);
            this._ch.writeBytes(bytes);
        } else if (size < 0x10000) {
            this._ch.writeUInt8(STRING_16);
            this._ch.writeUInt8(size / 256 >> 0);
            this._ch.writeUInt8(size % 256);
            this._ch.writeBytes(bytes);
        } else if (size < 0x100000000) {
            this._ch.writeUInt8(STRING_32);
            this._ch.writeUInt8((size / 16777216 >> 0) % 256);
            this._ch.writeUInt8((size / 65536 >> 0) % 256);
            this._ch.writeUInt8((size / 256 >> 0) % 256);
            this._ch.writeUInt8(size % 256);
            this._ch.writeBytes(bytes);
        } else {
            throw (0, neo4j_driver_core_1.newError)('UTF-8 strings of size ' + size + ' are not supported');
        }
    };
    Packer.prototype.packListHeader = function(size) {
        if (size < 0x10) {
            this._ch.writeUInt8(TINY_LIST | size);
        } else if (size < 0x100) {
            this._ch.writeUInt8(LIST_8);
            this._ch.writeUInt8(size);
        } else if (size < 0x10000) {
            this._ch.writeUInt8(LIST_16);
            this._ch.writeUInt8((size / 256 >> 0) % 256);
            this._ch.writeUInt8(size % 256);
        } else if (size < 0x100000000) {
            this._ch.writeUInt8(LIST_32);
            this._ch.writeUInt8((size / 16777216 >> 0) % 256);
            this._ch.writeUInt8((size / 65536 >> 0) % 256);
            this._ch.writeUInt8((size / 256 >> 0) % 256);
            this._ch.writeUInt8(size % 256);
        } else {
            throw (0, neo4j_driver_core_1.newError)('Lists of size ' + size + ' are not supported');
        }
    };
    Packer.prototype.packBytes = function(array) {
        if (this._byteArraysSupported) {
            this.packBytesHeader(array.length);
            for(var i = 0; i < array.length; i++){
                this._ch.writeInt8(array[i]);
            }
        } else {
            throw (0, neo4j_driver_core_1.newError)('Byte arrays are not supported by the database this driver is connected to');
        }
    };
    Packer.prototype.packBytesHeader = function(size) {
        if (size < 0x100) {
            this._ch.writeUInt8(BYTES_8);
            this._ch.writeUInt8(size);
        } else if (size < 0x10000) {
            this._ch.writeUInt8(BYTES_16);
            this._ch.writeUInt8((size / 256 >> 0) % 256);
            this._ch.writeUInt8(size % 256);
        } else if (size < 0x100000000) {
            this._ch.writeUInt8(BYTES_32);
            this._ch.writeUInt8((size / 16777216 >> 0) % 256);
            this._ch.writeUInt8((size / 65536 >> 0) % 256);
            this._ch.writeUInt8((size / 256 >> 0) % 256);
            this._ch.writeUInt8(size % 256);
        } else {
            throw (0, neo4j_driver_core_1.newError)('Byte arrays of size ' + size + ' are not supported');
        }
    };
    Packer.prototype.packMapHeader = function(size) {
        if (size < 0x10) {
            this._ch.writeUInt8(TINY_MAP | size);
        } else if (size < 0x100) {
            this._ch.writeUInt8(MAP_8);
            this._ch.writeUInt8(size);
        } else if (size < 0x10000) {
            this._ch.writeUInt8(MAP_16);
            this._ch.writeUInt8(size / 256 >> 0);
            this._ch.writeUInt8(size % 256);
        } else if (size < 0x100000000) {
            this._ch.writeUInt8(MAP_32);
            this._ch.writeUInt8((size / 16777216 >> 0) % 256);
            this._ch.writeUInt8((size / 65536 >> 0) % 256);
            this._ch.writeUInt8((size / 256 >> 0) % 256);
            this._ch.writeUInt8(size % 256);
        } else {
            throw (0, neo4j_driver_core_1.newError)('Maps of size ' + size + ' are not supported');
        }
    };
    Packer.prototype.packStructHeader = function(size, signature) {
        if (size < 0x10) {
            this._ch.writeUInt8(TINY_STRUCT | size);
            this._ch.writeUInt8(signature);
        } else if (size < 0x100) {
            this._ch.writeUInt8(STRUCT_8);
            this._ch.writeUInt8(size);
            this._ch.writeUInt8(signature);
        } else if (size < 0x10000) {
            this._ch.writeUInt8(STRUCT_16);
            this._ch.writeUInt8(size / 256 >> 0);
            this._ch.writeUInt8(size % 256);
        } else {
            throw (0, neo4j_driver_core_1.newError)('Structures of size ' + size + ' are not supported');
        }
    };
    Packer.prototype.disableByteArrays = function() {
        this._byteArraysSupported = false;
    };
    Packer.prototype._nonPackableValue = function(message) {
        return function() {
            throw (0, neo4j_driver_core_1.newError)(message, PROTOCOL_ERROR);
        };
    };
    return Packer;
}();
exports.Packer = Packer;
/**
 * Class to unpack
 * @access private
 */ var Unpacker = function() {
    /**
     * @constructor
     * @param {boolean} disableLosslessIntegers if this unpacker should convert all received integers to native JS numbers.
     * @param {boolean} useBigInt if this unpacker should convert all received integers to Bigint
     */ function Unpacker(disableLosslessIntegers, useBigInt) {
        if (disableLosslessIntegers === void 0) {
            disableLosslessIntegers = false;
        }
        if (useBigInt === void 0) {
            useBigInt = false;
        }
        this._disableLosslessIntegers = disableLosslessIntegers;
        this._useBigInt = useBigInt;
    }
    Unpacker.prototype.unpack = function(buffer, hydrateStructure) {
        if (hydrateStructure === void 0) {
            hydrateStructure = lang_1.functional.identity;
        }
        var marker = buffer.readUInt8();
        var markerHigh = marker & 0xf0;
        var markerLow = marker & 0x0f;
        if (marker === NULL) {
            return null;
        }
        var boolean = this._unpackBoolean(marker);
        if (boolean !== null) {
            return boolean;
        }
        var numberOrInteger = this._unpackNumberOrInteger(marker, buffer);
        if (numberOrInteger !== null) {
            if ((0, neo4j_driver_core_1.isInt)(numberOrInteger)) {
                if (this._useBigInt) {
                    return numberOrInteger.toBigInt();
                } else if (this._disableLosslessIntegers) {
                    return numberOrInteger.toNumberOrInfinity();
                }
            }
            return numberOrInteger;
        }
        var string = this._unpackString(marker, markerHigh, markerLow, buffer);
        if (string !== null) {
            return string;
        }
        var list = this._unpackList(marker, markerHigh, markerLow, buffer, hydrateStructure);
        if (list !== null) {
            return list;
        }
        var byteArray = this._unpackByteArray(marker, buffer);
        if (byteArray !== null) {
            return byteArray;
        }
        var map = this._unpackMap(marker, markerHigh, markerLow, buffer, hydrateStructure);
        if (map !== null) {
            return map;
        }
        var struct = this._unpackStruct(marker, markerHigh, markerLow, buffer, hydrateStructure);
        if (struct !== null) {
            return struct;
        }
        throw (0, neo4j_driver_core_1.newError)('Unknown packed value with marker ' + marker.toString(16));
    };
    Unpacker.prototype.unpackInteger = function(buffer) {
        var marker = buffer.readUInt8();
        var result = this._unpackInteger(marker, buffer);
        if (result == null) {
            throw (0, neo4j_driver_core_1.newError)('Unable to unpack integer value with marker ' + marker.toString(16));
        }
        return result;
    };
    Unpacker.prototype._unpackBoolean = function(marker) {
        if (marker === TRUE) {
            return true;
        } else if (marker === FALSE) {
            return false;
        } else {
            return null;
        }
    };
    Unpacker.prototype._unpackNumberOrInteger = function(marker, buffer) {
        if (marker === FLOAT_64) {
            return buffer.readFloat64();
        } else {
            return this._unpackInteger(marker, buffer);
        }
    };
    Unpacker.prototype._unpackInteger = function(marker, buffer) {
        if (marker >= 0 && marker < 128) {
            return (0, neo4j_driver_core_1.int)(marker);
        } else if (marker >= 240 && marker < 256) {
            return (0, neo4j_driver_core_1.int)(marker - 256);
        } else if (marker === INT_8) {
            return (0, neo4j_driver_core_1.int)(buffer.readInt8());
        } else if (marker === INT_16) {
            return (0, neo4j_driver_core_1.int)(buffer.readInt16());
        } else if (marker === INT_32) {
            var b = buffer.readInt32();
            return (0, neo4j_driver_core_1.int)(b);
        } else if (marker === INT_64) {
            var high = buffer.readInt32();
            var low = buffer.readInt32();
            return new neo4j_driver_core_1.Integer(low, high);
        } else {
            return null;
        }
    };
    Unpacker.prototype._unpackString = function(marker, markerHigh, markerLow, buffer) {
        if (markerHigh === TINY_STRING) {
            return channel_1.utf8.decode(buffer, markerLow);
        } else if (marker === STRING_8) {
            return channel_1.utf8.decode(buffer, buffer.readUInt8());
        } else if (marker === STRING_16) {
            return channel_1.utf8.decode(buffer, buffer.readUInt16());
        } else if (marker === STRING_32) {
            return channel_1.utf8.decode(buffer, buffer.readUInt32());
        } else {
            return null;
        }
    };
    Unpacker.prototype._unpackList = function(marker, markerHigh, markerLow, buffer, hydrateStructure) {
        if (markerHigh === TINY_LIST) {
            return this._unpackListWithSize(markerLow, buffer, hydrateStructure);
        } else if (marker === LIST_8) {
            return this._unpackListWithSize(buffer.readUInt8(), buffer, hydrateStructure);
        } else if (marker === LIST_16) {
            return this._unpackListWithSize(buffer.readUInt16(), buffer, hydrateStructure);
        } else if (marker === LIST_32) {
            return this._unpackListWithSize(buffer.readUInt32(), buffer, hydrateStructure);
        } else {
            return null;
        }
    };
    Unpacker.prototype._unpackListWithSize = function(size, buffer, hydrateStructure) {
        var value = [];
        for(var i = 0; i < size; i++){
            value.push(this.unpack(buffer, hydrateStructure));
        }
        return value;
    };
    Unpacker.prototype._unpackByteArray = function(marker, buffer) {
        if (marker === BYTES_8) {
            return this._unpackByteArrayWithSize(buffer.readUInt8(), buffer);
        } else if (marker === BYTES_16) {
            return this._unpackByteArrayWithSize(buffer.readUInt16(), buffer);
        } else if (marker === BYTES_32) {
            return this._unpackByteArrayWithSize(buffer.readUInt32(), buffer);
        } else {
            return null;
        }
    };
    Unpacker.prototype._unpackByteArrayWithSize = function(size, buffer) {
        var value = new Int8Array(size);
        for(var i = 0; i < size; i++){
            value[i] = buffer.readInt8();
        }
        return value;
    };
    Unpacker.prototype._unpackMap = function(marker, markerHigh, markerLow, buffer, hydrateStructure) {
        if (markerHigh === TINY_MAP) {
            return this._unpackMapWithSize(markerLow, buffer, hydrateStructure);
        } else if (marker === MAP_8) {
            return this._unpackMapWithSize(buffer.readUInt8(), buffer, hydrateStructure);
        } else if (marker === MAP_16) {
            return this._unpackMapWithSize(buffer.readUInt16(), buffer, hydrateStructure);
        } else if (marker === MAP_32) {
            return this._unpackMapWithSize(buffer.readUInt32(), buffer, hydrateStructure);
        } else {
            return null;
        }
    };
    Unpacker.prototype._unpackMapWithSize = function(size, buffer, hydrateStructure) {
        var value = {};
        for(var i = 0; i < size; i++){
            var key = this.unpack(buffer, hydrateStructure);
            value[key] = this.unpack(buffer, hydrateStructure);
        }
        return value;
    };
    Unpacker.prototype._unpackStruct = function(marker, markerHigh, markerLow, buffer, hydrateStructure) {
        if (markerHigh === TINY_STRUCT) {
            return this._unpackStructWithSize(markerLow, buffer, hydrateStructure);
        } else if (marker === STRUCT_8) {
            return this._unpackStructWithSize(buffer.readUInt8(), buffer, hydrateStructure);
        } else if (marker === STRUCT_16) {
            return this._unpackStructWithSize(buffer.readUInt16(), buffer, hydrateStructure);
        } else {
            return null;
        }
    };
    Unpacker.prototype._unpackStructWithSize = function(structSize, buffer, hydrateStructure) {
        var signature = buffer.readUInt8();
        var structure = new structure_1.Structure(signature, []);
        for(var i = 0; i < structSize; i++){
            structure.fields.push(this.unpack(buffer, hydrateStructure));
        }
        return hydrateStructure(structure);
    };
    return Unpacker;
}();
exports.Unpacker = Unpacker;
function isIterable(obj) {
    if (obj == null) {
        return false;
    }
    return typeof obj[Symbol.iterator] === 'function';
}
}),
"[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/packstream/packstream-v2.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
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
exports.Unpacker = exports.Packer = void 0;
var v1 = __importStar(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/packstream/packstream-v1.js [app-route] (ecmascript)"));
var Packer = function(_super) {
    __extends(Packer, _super);
    function Packer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Packer.prototype.disableByteArrays = function() {
        throw new Error('Bolt V2 should always support byte arrays');
    };
    return Packer;
}(v1.Packer);
exports.Packer = Packer;
var Unpacker = function(_super) {
    __extends(Unpacker, _super);
    /**
     * @constructor
     * @param {boolean} disableLosslessIntegers if this unpacker should convert all received integers to native JS numbers.
     * @param {boolean} useBigInt if this unpacker should convert all received integers to Bigint
     */ function Unpacker(disableLosslessIntegers, useBigInt) {
        if (disableLosslessIntegers === void 0) {
            disableLosslessIntegers = false;
        }
        if (useBigInt === void 0) {
            useBigInt = false;
        }
        return _super.call(this, disableLosslessIntegers, useBigInt) || this;
    }
    return Unpacker;
}(v1.Unpacker);
exports.Unpacker = Unpacker;
}),
"[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/packstream/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
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
exports.structure = exports.v2 = exports.v1 = void 0;
var v1 = __importStar(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/packstream/packstream-v1.js [app-route] (ecmascript)"));
exports.v1 = v1;
var v2 = __importStar(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/packstream/packstream-v2.js [app-route] (ecmascript)"));
exports.v2 = v2;
var structure = __importStar(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/packstream/structure.js [app-route] (ecmascript)"));
exports.structure = structure;
exports.default = v2;
}),
"[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/request-message.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
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
exports.SIGNATURES = void 0;
var neo4j_driver_core_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/index.js [app-route] (ecmascript)");
var _a = neo4j_driver_core_1.internal.constants, ACCESS_MODE_READ = _a.ACCESS_MODE_READ, FETCH_ALL = _a.FETCH_ALL, assertString = neo4j_driver_core_1.internal.util.assertString;
/* eslint-disable no-unused-vars */ // Signature bytes for each request message type
var INIT = 0x01; // 0000 0001 // INIT <user_agent> <authentication_token>
var ACK_FAILURE = 0x0e; // 0000 1110 // ACK_FAILURE - unused
var RESET = 0x0f; // 0000 1111 // RESET
var RUN = 0x10; // 0001 0000 // RUN <query> <parameters>
var DISCARD_ALL = 0x2f; // 0010 1111 // DISCARD_ALL - unused
var PULL_ALL = 0x3f; // 0011 1111 // PULL_ALL
var HELLO = 0x01; // 0000 0001 // HELLO <metadata>
var GOODBYE = 0x02; // 0000 0010 // GOODBYE
var BEGIN = 0x11; // 0001 0001 // BEGIN <metadata>
var COMMIT = 0x12; // 0001 0010 // COMMIT
var ROLLBACK = 0x13; // 0001 0011 // ROLLBACK
var TELEMETRY = 0x54; // 0101 0100 // TELEMETRY <api>
var ROUTE = 0x66; // 0110 0110 // ROUTE
var LOGON = 0x6A; // LOGON
var LOGOFF = 0x6B; // LOGOFF
var DISCARD = 0x2f; // 0010 1111 // DISCARD
var PULL = 0x3f; // 0011 1111 // PULL
var READ_MODE = 'r';
/* eslint-enable no-unused-vars */ var NO_STATEMENT_ID = -1;
var SIGNATURES = Object.freeze({
    INIT: INIT,
    RESET: RESET,
    RUN: RUN,
    PULL_ALL: PULL_ALL,
    HELLO: HELLO,
    GOODBYE: GOODBYE,
    BEGIN: BEGIN,
    COMMIT: COMMIT,
    ROLLBACK: ROLLBACK,
    TELEMETRY: TELEMETRY,
    ROUTE: ROUTE,
    LOGON: LOGON,
    LOGOFF: LOGOFF,
    DISCARD: DISCARD,
    PULL: PULL
});
exports.SIGNATURES = SIGNATURES;
var RequestMessage = function() {
    function RequestMessage(signature, fields, toString) {
        this.signature = signature;
        this.fields = fields;
        this.toString = toString;
    }
    /**
     * Create a new INIT message.
     * @param {string} clientName the client name.
     * @param {Object} authToken the authentication token.
     * @return {RequestMessage} new INIT message.
     */ RequestMessage.init = function(clientName, authToken) {
        return new RequestMessage(INIT, [
            clientName,
            authToken
        ], function() {
            return "INIT ".concat(clientName, " {...}");
        });
    };
    /**
     * Create a new RUN message.
     * @param {string} query the cypher query.
     * @param {Object} parameters the query parameters.
     * @return {RequestMessage} new RUN message.
     */ RequestMessage.run = function(query, parameters) {
        return new RequestMessage(RUN, [
            query,
            parameters
        ], function() {
            return "RUN ".concat(query, " ").concat(neo4j_driver_core_1.json.stringify(parameters));
        });
    };
    /**
     * Get a PULL_ALL message.
     * @return {RequestMessage} the PULL_ALL message.
     */ RequestMessage.pullAll = function() {
        return PULL_ALL_MESSAGE;
    };
    /**
     * Get a RESET message.
     * @return {RequestMessage} the RESET message.
     */ RequestMessage.reset = function() {
        return RESET_MESSAGE;
    };
    /**
     * Create a new HELLO message.
     * @param {string} userAgent the user agent.
     * @param {Object} authToken the authentication token.
     * @param {Object} optional server side routing, set to routing context to turn on server side routing (> 4.1)
     * @return {RequestMessage} new HELLO message.
     */ RequestMessage.hello = function(userAgent, authToken, routing, patchs) {
        if (routing === void 0) {
            routing = null;
        }
        if (patchs === void 0) {
            patchs = null;
        }
        var metadata = Object.assign({
            user_agent: userAgent
        }, authToken);
        if (routing) {
            metadata.routing = routing;
        }
        if (patchs) {
            metadata.patch_bolt = patchs;
        }
        return new RequestMessage(HELLO, [
            metadata
        ], function() {
            return "HELLO {user_agent: '".concat(userAgent, "', ...}");
        });
    };
    /**
     * Create a new HELLO message.
     * @param {string} userAgent the user agent.
     * @param {Object} optional server side routing, set to routing context to turn on server side routing (> 4.1)
     * @return {RequestMessage} new HELLO message.
     */ RequestMessage.hello5x1 = function(userAgent, routing) {
        if (routing === void 0) {
            routing = null;
        }
        var metadata = {
            user_agent: userAgent
        };
        if (routing) {
            metadata.routing = routing;
        }
        return new RequestMessage(HELLO, [
            metadata
        ], function() {
            return "HELLO {user_agent: '".concat(userAgent, "', ...}");
        });
    };
    /**
     * Create a new HELLO message.
     * @param {string} userAgent the user agent.
     * @param {NotificationFilter} notificationFilter the notification filter configured
     * @param {Object} routing server side routing, set to routing context to turn on server side routing (> 4.1)
     * @return {RequestMessage} new HELLO message.
     */ RequestMessage.hello5x2 = function(userAgent, notificationFilter, routing) {
        if (notificationFilter === void 0) {
            notificationFilter = null;
        }
        if (routing === void 0) {
            routing = null;
        }
        var metadata = {
            user_agent: userAgent
        };
        appendLegacyNotificationFilterToMetadata(metadata, notificationFilter);
        if (routing) {
            metadata.routing = routing;
        }
        return new RequestMessage(HELLO, [
            metadata
        ], function() {
            return "HELLO ".concat(neo4j_driver_core_1.json.stringify(metadata));
        });
    };
    /**
     * Create a new HELLO message.
     * @param {string} userAgent the user agent.
     * @param {string} boltAgent the bolt agent.
     * @param {NotificationFilter} notificationFilter the notification filter configured
     * @param {Object} routing server side routing, set to routing context to turn on server side routing (> 4.1)
     * @return {RequestMessage} new HELLO message.
     */ RequestMessage.hello5x3 = function(userAgent, boltAgent, notificationFilter, routing) {
        if (notificationFilter === void 0) {
            notificationFilter = null;
        }
        if (routing === void 0) {
            routing = null;
        }
        var metadata = {};
        if (userAgent) {
            metadata.user_agent = userAgent;
        }
        if (boltAgent) {
            metadata.bolt_agent = {
                product: boltAgent.product,
                platform: boltAgent.platform,
                language: boltAgent.language,
                language_details: boltAgent.languageDetails
            };
        }
        appendLegacyNotificationFilterToMetadata(metadata, notificationFilter);
        if (routing) {
            metadata.routing = routing;
        }
        return new RequestMessage(HELLO, [
            metadata
        ], function() {
            return "HELLO ".concat(neo4j_driver_core_1.json.stringify(metadata));
        });
    };
    /**
     * Create a new HELLO message.
     * @param {string} userAgent the user agent.
     * @param {string} boltAgent the bolt agent.
     * @param {NotificationFilter} notificationFilter the notification filter configured
     * @param {Object} routing server side routing, set to routing context to turn on server side routing (> 4.1)
     * @return {RequestMessage} new HELLO message.
     */ RequestMessage.hello5x5 = function(userAgent, boltAgent, notificationFilter, routing) {
        if (notificationFilter === void 0) {
            notificationFilter = null;
        }
        if (routing === void 0) {
            routing = null;
        }
        var metadata = {};
        if (userAgent) {
            metadata.user_agent = userAgent;
        }
        if (boltAgent) {
            metadata.bolt_agent = {
                product: boltAgent.product,
                platform: boltAgent.platform,
                language: boltAgent.language,
                language_details: boltAgent.languageDetails
            };
        }
        appendGqlNotificationFilterToMetadata(metadata, notificationFilter);
        if (routing) {
            metadata.routing = routing;
        }
        return new RequestMessage(HELLO, [
            metadata
        ], function() {
            return "HELLO ".concat(neo4j_driver_core_1.json.stringify(metadata));
        });
    };
    /**
     * Create a new LOGON message.
     *
     * @param {object} authToken The auth token
     * @returns {RequestMessage} new LOGON message
     */ RequestMessage.logon = function(authToken) {
        return new RequestMessage(LOGON, [
            authToken
        ], function() {
            return 'LOGON { ... }';
        });
    };
    /**
     * Create a new LOGOFF message.
     *
     * @returns {RequestMessage} new LOGOFF message
     */ RequestMessage.logoff = function() {
        return new RequestMessage(LOGOFF, [], function() {
            return 'LOGOFF';
        });
    };
    /**
     * Create a new BEGIN message.
     * @param {Bookmarks} bookmarks the bookmarks.
     * @param {TxConfig} txConfig the configuration.
     * @param {string} database the database name.
     * @param {string} mode the access mode.
     * @param {string} impersonatedUser the impersonated user.
     * @param {NotificationFilter} notificationFilter the notification filter
     * @return {RequestMessage} new BEGIN message.
     */ RequestMessage.begin = function(_a) {
        var _b = _a === void 0 ? {} : _a, bookmarks = _b.bookmarks, txConfig = _b.txConfig, database = _b.database, mode = _b.mode, impersonatedUser = _b.impersonatedUser, notificationFilter = _b.notificationFilter;
        var metadata = buildTxMetadata(bookmarks, txConfig, database, mode, impersonatedUser, notificationFilter);
        return new RequestMessage(BEGIN, [
            metadata
        ], function() {
            return "BEGIN ".concat(neo4j_driver_core_1.json.stringify(metadata));
        });
    };
    /**
     * Create a new BEGIN message.
     * @param {Bookmarks} bookmarks the bookmarks.
     * @param {TxConfig} txConfig the configuration.
     * @param {string} database the database name.
     * @param {string} mode the access mode.
     * @param {string} impersonatedUser the impersonated user.
     * @param {NotificationFilter} notificationFilter the notification filter
     * @return {RequestMessage} new BEGIN message.
     */ RequestMessage.begin5x5 = function(_a) {
        var _b = _a === void 0 ? {} : _a, bookmarks = _b.bookmarks, txConfig = _b.txConfig, database = _b.database, mode = _b.mode, impersonatedUser = _b.impersonatedUser, notificationFilter = _b.notificationFilter;
        var metadata = buildTxMetadata(bookmarks, txConfig, database, mode, impersonatedUser, notificationFilter, {
            appendNotificationFilter: appendGqlNotificationFilterToMetadata
        });
        return new RequestMessage(BEGIN, [
            metadata
        ], function() {
            return "BEGIN ".concat(neo4j_driver_core_1.json.stringify(metadata));
        });
    };
    /**
     * Get a COMMIT message.
     * @return {RequestMessage} the COMMIT message.
     */ RequestMessage.commit = function() {
        return COMMIT_MESSAGE;
    };
    /**
     * Get a ROLLBACK message.
     * @return {RequestMessage} the ROLLBACK message.
     */ RequestMessage.rollback = function() {
        return ROLLBACK_MESSAGE;
    };
    /**
     * Create a new RUN message with additional metadata.
     * @param {string} query the cypher query.
     * @param {Object} parameters the query parameters.
     * @param {Object} extra - extra params
     * @param {Bookmarks} extra.bookmarks the bookmarks.
     * @param {TxConfig} extra.txConfig the configuration.
     * @param {string} extra.database the database name.
     * @param {string} extra.mode the access mode.
     * @param {string} extra.impersonatedUser the impersonated user.
     * @param {notificationFilter} extra.notificationFilter the notification filter
     * @return {RequestMessage} new RUN message with additional metadata.
     */ RequestMessage.runWithMetadata = function(query, parameters, _a) {
        var _b = _a === void 0 ? {} : _a, bookmarks = _b.bookmarks, txConfig = _b.txConfig, database = _b.database, mode = _b.mode, impersonatedUser = _b.impersonatedUser, notificationFilter = _b.notificationFilter;
        var metadata = buildTxMetadata(bookmarks, txConfig, database, mode, impersonatedUser, notificationFilter);
        return new RequestMessage(RUN, [
            query,
            parameters,
            metadata
        ], function() {
            return "RUN ".concat(query, " ").concat(neo4j_driver_core_1.json.stringify(parameters), " ").concat(neo4j_driver_core_1.json.stringify(metadata));
        });
    };
    /**
     * Create a new RUN message with additional metadata.
     * @param {string} query the cypher query.
     * @param {Object} parameters the query parameters.
     * @param {Object} extra - extra params
     * @param {Bookmarks} extra.bookmarks the bookmarks.
     * @param {TxConfig} extra.txConfig the configuration.
     * @param {string} extra.database the database name.
     * @param {string} extra.mode the access mode.
     * @param {string} extra.impersonatedUser the impersonated user.
     * @param {notificationFilter} extra.notificationFilter the notification filter
     * @return {RequestMessage} new RUN message with additional metadata.
     */ RequestMessage.runWithMetadata5x5 = function(query, parameters, _a) {
        var _b = _a === void 0 ? {} : _a, bookmarks = _b.bookmarks, txConfig = _b.txConfig, database = _b.database, mode = _b.mode, impersonatedUser = _b.impersonatedUser, notificationFilter = _b.notificationFilter;
        var metadata = buildTxMetadata(bookmarks, txConfig, database, mode, impersonatedUser, notificationFilter, {
            appendNotificationFilter: appendGqlNotificationFilterToMetadata
        });
        return new RequestMessage(RUN, [
            query,
            parameters,
            metadata
        ], function() {
            return "RUN ".concat(query, " ").concat(neo4j_driver_core_1.json.stringify(parameters), " ").concat(neo4j_driver_core_1.json.stringify(metadata));
        });
    };
    /**
     * Get a GOODBYE message.
     * @return {RequestMessage} the GOODBYE message.
     */ RequestMessage.goodbye = function() {
        return GOODBYE_MESSAGE;
    };
    /**
     * Generates a new PULL message with additional metadata.
     * @param {Integer|number} stmtId
     * @param {Integer|number} n
     * @return {RequestMessage} the PULL message.
     */ RequestMessage.pull = function(_a) {
        var _b = _a === void 0 ? {} : _a, _c = _b.stmtId, stmtId = _c === void 0 ? NO_STATEMENT_ID : _c, _d = _b.n, n = _d === void 0 ? FETCH_ALL : _d;
        var metadata = buildStreamMetadata(stmtId === null || stmtId === undefined ? NO_STATEMENT_ID : stmtId, n || FETCH_ALL);
        return new RequestMessage(PULL, [
            metadata
        ], function() {
            return "PULL ".concat(neo4j_driver_core_1.json.stringify(metadata));
        });
    };
    /**
     * Generates a new DISCARD message with additional metadata.
     * @param {Integer|number} stmtId
     * @param {Integer|number} n
     * @return {RequestMessage} the PULL message.
     */ RequestMessage.discard = function(_a) {
        var _b = _a === void 0 ? {} : _a, _c = _b.stmtId, stmtId = _c === void 0 ? NO_STATEMENT_ID : _c, _d = _b.n, n = _d === void 0 ? FETCH_ALL : _d;
        var metadata = buildStreamMetadata(stmtId === null || stmtId === undefined ? NO_STATEMENT_ID : stmtId, n || FETCH_ALL);
        return new RequestMessage(DISCARD, [
            metadata
        ], function() {
            return "DISCARD ".concat(neo4j_driver_core_1.json.stringify(metadata));
        });
    };
    RequestMessage.telemetry = function(_a) {
        var api = _a.api;
        var parsedApi = (0, neo4j_driver_core_1.int)(api);
        return new RequestMessage(TELEMETRY, [
            parsedApi
        ], function() {
            return "TELEMETRY ".concat(parsedApi.toString());
        });
    };
    /**
     * Generate the ROUTE message, this message is used to fetch the routing table from the server
     *
     * @param {object} routingContext The routing context used to define the routing table. Multi-datacenter deployments is one of its use cases
     * @param {string[]} bookmarks The list of the bookmarks should be used
     * @param {string} databaseName The name of the database to get the routing table for.
     * @return {RequestMessage} the ROUTE message.
     */ RequestMessage.route = function(routingContext, bookmarks, databaseName) {
        if (routingContext === void 0) {
            routingContext = {};
        }
        if (bookmarks === void 0) {
            bookmarks = [];
        }
        if (databaseName === void 0) {
            databaseName = null;
        }
        return new RequestMessage(ROUTE, [
            routingContext,
            bookmarks,
            databaseName
        ], function() {
            return "ROUTE ".concat(neo4j_driver_core_1.json.stringify(routingContext), " ").concat(neo4j_driver_core_1.json.stringify(bookmarks), " ").concat(databaseName);
        });
    };
    /**
     * Generate the ROUTE message, this message is used to fetch the routing table from the server
     *
     * @param {object} routingContext The routing context used to define the routing table. Multi-datacenter deployments is one of its use cases
     * @param {string[]} bookmarks The list of the bookmarks should be used
     * @param {object} databaseContext The context inforamtion of the database to get the routing table for.
     * @param {string} databaseContext.databaseName The name of the database to get the routing table.
     * @param {string} databaseContext.impersonatedUser The name of the user to impersonation when getting the routing table.
     * @return {RequestMessage} the ROUTE message.
     */ RequestMessage.routeV4x4 = function(routingContext, bookmarks, databaseContext) {
        if (routingContext === void 0) {
            routingContext = {};
        }
        if (bookmarks === void 0) {
            bookmarks = [];
        }
        if (databaseContext === void 0) {
            databaseContext = {};
        }
        var dbContext = {};
        if (databaseContext.databaseName) {
            dbContext.db = databaseContext.databaseName;
        }
        if (databaseContext.impersonatedUser) {
            dbContext.imp_user = databaseContext.impersonatedUser;
        }
        return new RequestMessage(ROUTE, [
            routingContext,
            bookmarks,
            dbContext
        ], function() {
            return "ROUTE ".concat(neo4j_driver_core_1.json.stringify(routingContext), " ").concat(neo4j_driver_core_1.json.stringify(bookmarks), " ").concat(neo4j_driver_core_1.json.stringify(dbContext));
        });
    };
    return RequestMessage;
}();
exports.default = RequestMessage;
/**
 * Create an object that represent transaction metadata.
 * @param {Bookmarks} bookmarks the bookmarks.
 * @param {TxConfig} txConfig the configuration.
 * @param {string} database the database name.
 * @param {string} mode the access mode.
 * @param {string} impersonatedUser the impersonated user mode.
 * @param {notificationFilter} notificationFilter the notification filter
 * @param {Object} functions Transformation functions applied to metadata
 * @param {function(metadata,notificationFilter):void} functions.appendNotificationFilter Changes metadata by appending the Notification Filter to it.
 * @return {Object} a metadata object.
 */ function buildTxMetadata(bookmarks, txConfig, database, mode, impersonatedUser, notificationFilter, functions) {
    var _a;
    if (functions === void 0) {
        functions = {};
    }
    var metadata = {};
    if (!bookmarks.isEmpty()) {
        metadata.bookmarks = bookmarks.values();
    }
    if (txConfig.timeout !== null) {
        metadata.tx_timeout = txConfig.timeout;
    }
    if (txConfig.metadata) {
        metadata.tx_metadata = txConfig.metadata;
    }
    if (database) {
        metadata.db = assertString(database, 'database');
    }
    if (impersonatedUser) {
        metadata.imp_user = assertString(impersonatedUser, 'impersonatedUser');
    }
    if (mode === ACCESS_MODE_READ) {
        metadata.mode = READ_MODE;
    }
    var appendNotificationFilter = (_a = functions.appendNotificationFilter) !== null && _a !== void 0 ? _a : appendLegacyNotificationFilterToMetadata;
    appendNotificationFilter(metadata, notificationFilter);
    return metadata;
}
/**
 * Create an object that represents streaming metadata.
 * @param {Integer|number} stmtId The query id to stream its results.
 * @param {Integer|number} n The number of records to stream.
 * @returns {Object} a metadata object.
 */ function buildStreamMetadata(stmtId, n) {
    var metadata = {
        n: (0, neo4j_driver_core_1.int)(n)
    };
    if (stmtId !== NO_STATEMENT_ID) {
        metadata.qid = (0, neo4j_driver_core_1.int)(stmtId);
    }
    return metadata;
}
function appendLegacyNotificationFilterToMetadata(metadata, notificationFilter) {
    if (notificationFilter) {
        if (notificationFilter.minimumSeverityLevel) {
            metadata.notifications_minimum_severity = notificationFilter.minimumSeverityLevel;
        }
        if (notificationFilter.disabledCategories) {
            metadata.notifications_disabled_categories = notificationFilter.disabledCategories;
        }
        if (notificationFilter.disabledClassifications) {
            metadata.notifications_disabled_categories = notificationFilter.disabledClassifications;
        }
    }
}
function appendGqlNotificationFilterToMetadata(metadata, notificationFilter) {
    if (notificationFilter) {
        if (notificationFilter.minimumSeverityLevel) {
            metadata.notifications_minimum_severity = notificationFilter.minimumSeverityLevel;
        }
        if (notificationFilter.disabledCategories) {
            metadata.notifications_disabled_classifications = notificationFilter.disabledCategories;
        }
        if (notificationFilter.disabledClassifications) {
            metadata.notifications_disabled_classifications = notificationFilter.disabledClassifications;
        }
    }
}
// constants for messages that never change
var PULL_ALL_MESSAGE = new RequestMessage(PULL_ALL, [], function() {
    return 'PULL_ALL';
});
var RESET_MESSAGE = new RequestMessage(RESET, [], function() {
    return 'RESET';
});
var COMMIT_MESSAGE = new RequestMessage(COMMIT, [], function() {
    return 'COMMIT';
});
var ROLLBACK_MESSAGE = new RequestMessage(ROLLBACK, [], function() {
    return 'ROLLBACK';
});
var GOODBYE_MESSAGE = new RequestMessage(GOODBYE, [], function() {
    return 'GOODBYE';
});
}),
"[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/transformer.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
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
exports.TypeTransformer = void 0;
var packstream_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/packstream/index.js [app-route] (ecmascript)");
var neo4j_driver_core_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/index.js [app-route] (ecmascript)");
var objectUtil = neo4j_driver_core_1.internal.objectUtil;
/**
 * Class responsible for applying the expected {@link TypeTransformer} to
 * transform the driver types from and to {@link struct.Structure}
 */ var Transformer = function() {
    /**
     * Constructor
     * @param {TypeTransformer[]} transformers The type transformers
     */ function Transformer(transformers) {
        this._transformers = transformers;
        this._transformersPerSignature = new Map(transformers.map(function(typeTransformer) {
            return [
                typeTransformer.signature,
                typeTransformer
            ];
        }));
        this.fromStructure = this.fromStructure.bind(this);
        this.toStructure = this.toStructure.bind(this);
        Object.freeze(this);
    }
    /**
     * Transform from structure to specific object
     *
     * @param {struct.Structure} struct The structure
     * @returns {<T>|structure.Structure} The driver object or the structure if the transformer was not found.
     */ Transformer.prototype.fromStructure = function(struct) {
        try {
            if (struct instanceof packstream_1.structure.Structure && this._transformersPerSignature.has(struct.signature)) {
                var fromStructure = this._transformersPerSignature.get(struct.signature).fromStructure;
                return fromStructure(struct);
            }
            return struct;
        } catch (error) {
            return objectUtil.createBrokenObject(error);
        }
    };
    /**
     * Transform from object to structure
     * @param {<T>} type The object to be transoformed in structure
     * @returns {<T>|structure.Structure} The structure or the object, if any transformer was found
     */ Transformer.prototype.toStructure = function(type) {
        var valueType = typeof type;
        // captures 'string' | 'boolean' | 'bigint' | 'number' | 'undefined' | null
        if (valueType !== 'object' && valueType !== 'function' && valueType !== 'symbol' || type === null) {
            return type;
        }
        var transformer = this._transformers.find(function(_a) {
            var isTypeInstance = _a.isTypeInstance;
            return isTypeInstance(type);
        });
        if (transformer !== undefined) {
            return transformer.toStructure(type);
        }
        return type;
    };
    return Transformer;
}();
exports.default = Transformer;
/**
 * @callback isTypeInstanceFunction
 * @param {any} object The object
 * @return {boolean} is instance of
 */ /**
 * @callback toStructureFunction
 * @param {any} object The object
 * @return {structure.Structure} The structure
 */ /**
 * @callback fromStructureFunction
 * @param {structure.Structure} struct The structure
 * @return {any} The object
 */ /**
 * Class responsible for grouping the properties of a TypeTransformer
 */ var TypeTransformer = function() {
    /**
     * @param {Object} param
     * @param {number} param.signature The signature of the structure
     * @param {isTypeInstanceFunction} param.isTypeInstance The function which checks if object is
     *                instance of the type described by the TypeTransformer
     * @param {toStructureFunction} param.toStructure The function which gets the object and converts to structure
     * @param {fromStructureFunction} param.fromStructure The function which get the structure and covnverts to object
     */ function TypeTransformer(_a) {
        var signature = _a.signature, fromStructure = _a.fromStructure, toStructure = _a.toStructure, isTypeInstance = _a.isTypeInstance;
        this.signature = signature;
        this.isTypeInstance = isTypeInstance;
        this.fromStructure = fromStructure;
        this.toStructure = toStructure;
        Object.freeze(this);
    }
    /**
     * @param {Object} param
     * @param {number} [param.signature] The signature of the structure
     * @param {isTypeInstanceFunction} [param.isTypeInstance] The function which checks if object is
     *                instance of the type described by the TypeTransformer
     * @param {toStructureFunction} [param.toStructure] The function which gets the object and converts to structure
     * @param {fromStructureFunction} [param.fromStructure] The function which get the structure and covnverts to object
     * @returns {TypeTransformer} A new type transform extends with new methods
     */ TypeTransformer.prototype.extendsWith = function(_a) {
        var signature = _a.signature, fromStructure = _a.fromStructure, toStructure = _a.toStructure, isTypeInstance = _a.isTypeInstance;
        return new TypeTransformer({
            signature: signature || this.signature,
            fromStructure: fromStructure || this.fromStructure,
            toStructure: toStructure || this.toStructure,
            isTypeInstance: isTypeInstance || this.isTypeInstance
        });
    };
    return TypeTransformer;
}();
exports.TypeTransformer = TypeTransformer;
}),
"[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/bolt-protocol-v1.transformer.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
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
 */ var __read = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__read || function(o, n) {
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
var neo4j_driver_core_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/index.js [app-route] (ecmascript)");
var packstream_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/packstream/index.js [app-route] (ecmascript)");
var transformer_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/transformer.js [app-route] (ecmascript)");
var PROTOCOL_ERROR = neo4j_driver_core_1.error.PROTOCOL_ERROR;
var NODE = 0x4e;
var NODE_STRUCT_SIZE = 3;
var RELATIONSHIP = 0x52;
var RELATIONSHIP_STRUCT_SIZE = 5;
var UNBOUND_RELATIONSHIP = 0x72;
var UNBOUND_RELATIONSHIP_STRUCT_SIZE = 3;
var PATH = 0x50;
var PATH_STRUCT_SIZE = 3;
var VECTOR = 0x56;
/**
 * Creates the Node Transformer
 * @returns {TypeTransformer}
 */ function createNodeTransformer() {
    return new transformer_1.TypeTransformer({
        signature: NODE,
        isTypeInstance: function(object) {
            return object instanceof neo4j_driver_core_1.Node;
        },
        toStructure: function(object) {
            throw (0, neo4j_driver_core_1.newError)("It is not allowed to pass nodes in query parameters, given: ".concat(object), PROTOCOL_ERROR);
        },
        fromStructure: function(struct) {
            packstream_1.structure.verifyStructSize('Node', NODE_STRUCT_SIZE, struct.size);
            var _a = __read(struct.fields, 3), identity = _a[0], labels = _a[1], properties = _a[2];
            return new neo4j_driver_core_1.Node(identity, labels, properties);
        }
    });
}
/**
 * Creates the Relationship Transformer
 * @returns {TypeTransformer}
 */ function createRelationshipTransformer() {
    return new transformer_1.TypeTransformer({
        signature: RELATIONSHIP,
        isTypeInstance: function(object) {
            return object instanceof neo4j_driver_core_1.Relationship;
        },
        toStructure: function(object) {
            throw (0, neo4j_driver_core_1.newError)("It is not allowed to pass relationships in query parameters, given: ".concat(object), PROTOCOL_ERROR);
        },
        fromStructure: function(struct) {
            packstream_1.structure.verifyStructSize('Relationship', RELATIONSHIP_STRUCT_SIZE, struct.size);
            var _a = __read(struct.fields, 5), identity = _a[0], startNodeIdentity = _a[1], endNodeIdentity = _a[2], type = _a[3], properties = _a[4];
            return new neo4j_driver_core_1.Relationship(identity, startNodeIdentity, endNodeIdentity, type, properties);
        }
    });
}
/**
 * Creates the Unbound Relationship Transformer
 * @returns {TypeTransformer}
 */ function createUnboundRelationshipTransformer() {
    return new transformer_1.TypeTransformer({
        signature: UNBOUND_RELATIONSHIP,
        isTypeInstance: function(object) {
            return object instanceof neo4j_driver_core_1.UnboundRelationship;
        },
        toStructure: function(object) {
            throw (0, neo4j_driver_core_1.newError)("It is not allowed to pass unbound relationships in query parameters, given: ".concat(object), PROTOCOL_ERROR);
        },
        fromStructure: function(struct) {
            packstream_1.structure.verifyStructSize('UnboundRelationship', UNBOUND_RELATIONSHIP_STRUCT_SIZE, struct.size);
            var _a = __read(struct.fields, 3), identity = _a[0], type = _a[1], properties = _a[2];
            return new neo4j_driver_core_1.UnboundRelationship(identity, type, properties);
        }
    });
}
/**
 * Creates the Path Transformer
 * @returns {TypeTransformer}
 */ function createPathTransformer() {
    return new transformer_1.TypeTransformer({
        signature: PATH,
        isTypeInstance: function(object) {
            return object instanceof neo4j_driver_core_1.Path;
        },
        toStructure: function(object) {
            throw (0, neo4j_driver_core_1.newError)("It is not allowed to pass paths in query parameters, given: ".concat(object), PROTOCOL_ERROR);
        },
        fromStructure: function(struct) {
            packstream_1.structure.verifyStructSize('Path', PATH_STRUCT_SIZE, struct.size);
            var _a = __read(struct.fields, 3), nodes = _a[0], rels = _a[1], sequence = _a[2];
            var segments = [];
            var prevNode = nodes[0];
            for(var i = 0; i < sequence.length; i += 2){
                var nextNode = nodes[sequence[i + 1]];
                var relIndex = (0, neo4j_driver_core_1.toNumber)(sequence[i]);
                var rel = void 0;
                if (relIndex > 0) {
                    rel = rels[relIndex - 1];
                    if (rel instanceof neo4j_driver_core_1.UnboundRelationship) {
                        // To avoid duplication, relationships in a path do not contain
                        // information about their start and end nodes, that's instead
                        // inferred from the path sequence. This is us inferring (and,
                        // for performance reasons remembering) the start/end of a rel.
                        rels[relIndex - 1] = rel = rel.bindTo(prevNode, nextNode);
                    }
                } else {
                    rel = rels[-relIndex - 1];
                    if (rel instanceof neo4j_driver_core_1.UnboundRelationship) {
                        // See above
                        rels[-relIndex - 1] = rel = rel.bindTo(nextNode, prevNode);
                    }
                }
                // Done hydrating one path segment.
                segments.push(new neo4j_driver_core_1.PathSegment(prevNode, rel, nextNode));
                prevNode = nextNode;
            }
            return new neo4j_driver_core_1.Path(nodes[0], nodes[nodes.length - 1], segments);
        }
    });
}
/**
 * Creates a typeTransformer that throws errors if vectors are transmitted.
 * @returns {TypeTransformer}
 */ function createVectorTransformer() {
    return new transformer_1.TypeTransformer({
        signature: VECTOR,
        isTypeInstance: function(object) {
            return object instanceof neo4j_driver_core_1.Vector;
        },
        toStructure: function(_) {
            throw (0, neo4j_driver_core_1.newError)('Sending vector types require server and driver to be communicating with Bolt protocol 6.0 or later. Please update your database version.');
        },
        fromStructure: function(_) {
            throw (0, neo4j_driver_core_1.newError)('Server tried to send Vector object, but server and driver are communicating on a version of the Bolt protocol that does not support vectors.');
        }
    });
}
exports.default = {
    createNodeTransformer: createNodeTransformer,
    createRelationshipTransformer: createRelationshipTransformer,
    createUnboundRelationshipTransformer: createUnboundRelationshipTransformer,
    createPathTransformer: createPathTransformer,
    createVectorTransformer: createVectorTransformer
};
}),
"[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/bolt-protocol-v1.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
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
var __importDefault = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : {
        "default": mod
    };
};
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
 */ var bolt_protocol_util_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/bolt-protocol-util.js [app-route] (ecmascript)");
// eslint-disable-next-line no-unused-vars
var channel_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/channel/index.js [app-route] (ecmascript)");
var packstream_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/packstream/index.js [app-route] (ecmascript)");
var request_message_1 = __importStar(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/request-message.js [app-route] (ecmascript)"));
var stream_observers_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/stream-observers.js [app-route] (ecmascript)");
var neo4j_driver_core_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/index.js [app-route] (ecmascript)");
var bolt_protocol_v1_transformer_1 = __importDefault(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/bolt-protocol-v1.transformer.js [app-route] (ecmascript)"));
var transformer_1 = __importDefault(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/transformer.js [app-route] (ecmascript)"));
var Bookmarks = neo4j_driver_core_1.internal.bookmarks.Bookmarks, _a = neo4j_driver_core_1.internal.constants, ACCESS_MODE_WRITE = _a.ACCESS_MODE_WRITE, BOLT_PROTOCOL_V1 = _a.BOLT_PROTOCOL_V1, Logger = neo4j_driver_core_1.internal.logger.Logger, TxConfig = neo4j_driver_core_1.internal.txConfig.TxConfig;
var DEFAULT_DIAGNOSTIC_RECORD = Object.freeze({
    OPERATION: '',
    OPERATION_CODE: '0',
    CURRENT_SCHEMA: '/'
});
var BoltProtocol = function() {
    /**
     * @callback CreateResponseHandler Creates the response handler
     * @param {BoltProtocol} protocol The bolt protocol
     * @returns {ResponseHandler} The response handler
     */ /**
     * @callback OnProtocolError Handles protocol error
     * @param {string} error The description
     */ /**
     * @constructor
     * @param {Object} server the server informatio.
     * @param {Chunker} chunker the chunker.
     * @param {Object} packstreamConfig Packstream configuration
     * @param {boolean} packstreamConfig.disableLosslessIntegers if this connection should convert all received integers to native JS numbers.
     * @param {boolean} packstreamConfig.useBigInt if this connection should convert all received integers to native BigInt numbers.
     * @param {CreateResponseHandler} createResponseHandler Function which creates the response handler
     * @param {Logger} log the logger
     * @param {OnProtocolError} onProtocolError handles protocol errors
     */ function BoltProtocol(server, chunker, _a, createResponseHandler, log, onProtocolError) {
        var _b = _a === void 0 ? {} : _a, disableLosslessIntegers = _b.disableLosslessIntegers, useBigInt = _b.useBigInt;
        if (createResponseHandler === void 0) {
            createResponseHandler = function() {
                return null;
            };
        }
        this._server = server || {};
        this._chunker = chunker;
        this._packer = this._createPacker(chunker);
        this._unpacker = this._createUnpacker(disableLosslessIntegers, useBigInt);
        this._responseHandler = createResponseHandler(this);
        this._log = log;
        this._onProtocolError = onProtocolError;
        this._fatalError = null;
        this._lastMessageSignature = null;
        this._config = {
            disableLosslessIntegers: disableLosslessIntegers,
            useBigInt: useBigInt
        };
    }
    Object.defineProperty(BoltProtocol.prototype, "transformer", {
        get: function() {
            var _this = this;
            if (this._transformer === undefined) {
                this._transformer = new transformer_1.default(Object.values(bolt_protocol_v1_transformer_1.default).map(function(create) {
                    return create(_this._config, _this._log);
                }));
            }
            return this._transformer;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BoltProtocol.prototype, "version", {
        /**
         * Returns the stringified version identifier for this protocol
         */ get: function() {
            return BOLT_PROTOCOL_V1;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BoltProtocol.prototype, "supportsReAuth", {
        /**
         * @property {boolean} supportsReAuth Either if the protocol version supports re-auth or not.
         */ get: function() {
            return false;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BoltProtocol.prototype, "initialized", {
        /**
         * @property {boolean} initialized Either if the protocol was initialized or not
         */ get: function() {
            return !!this._initialized;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BoltProtocol.prototype, "authToken", {
        /**
         * @property {object} authToken The token used in the last login
         */ get: function() {
            return this._authToken;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Get the packer.
     * @return {Packer} the protocol's packer.
     */ BoltProtocol.prototype.packer = function() {
        return this._packer;
    };
    /**
     * Creates a packable function out of the provided value
     * @param x the value to pack
     * @returns Function
     */ BoltProtocol.prototype.packable = function(x) {
        return this._packer.packable(x, this.transformer.toStructure);
    };
    /**
     * Get the unpacker.
     * @return {Unpacker} the protocol's unpacker.
     */ BoltProtocol.prototype.unpacker = function() {
        return this._unpacker;
    };
    /**
     * Unpack a buffer
     * @param {Buffer} buf
     * @returns {any|null} The unpacked value
     */ BoltProtocol.prototype.unpack = function(buf) {
        return this._unpacker.unpack(buf, this.transformer.fromStructure);
    };
    /**
     * Transform metadata received in SUCCESS message before it is passed to the handler.
     * @param {Object} metadata the received metadata.
     * @return {Object} transformed metadata.
     */ BoltProtocol.prototype.transformMetadata = function(metadata) {
        return metadata;
    };
    BoltProtocol.prototype.enrichErrorMetadata = function(metadata) {
        return __assign(__assign({}, metadata), {
            diagnostic_record: metadata.diagnostic_record !== null ? __assign(__assign({}, DEFAULT_DIAGNOSTIC_RECORD), metadata.diagnostic_record) : null
        });
    };
    /**
     * Perform initialization and authentication of the underlying connection.
     * @param {Object} param
     * @param {string} param.userAgent the user agent.
     * @param {Object} param.authToken the authentication token.
     * @param {NotificationFilter} param.notificationFilter the notification filter.
     * @param {function(err: Error)} param.onError the callback to invoke on error.
     * @param {function()} param.onComplete the callback to invoke on completion.
     * @returns {StreamObserver} the stream observer that monitors the corresponding server response.
     */ BoltProtocol.prototype.initialize = function(_a) {
        var _this = this;
        var _b = _a === void 0 ? {} : _a, userAgent = _b.userAgent, boltAgent = _b.boltAgent, authToken = _b.authToken, notificationFilter = _b.notificationFilter, onError = _b.onError, onComplete = _b.onComplete;
        var observer = new stream_observers_1.LoginObserver({
            onError: function(error) {
                return _this._onLoginError(error, onError);
            },
            onCompleted: function(metadata) {
                return _this._onLoginCompleted(metadata, onComplete);
            }
        });
        // passing notification filter on this protocol version throws an error
        (0, bolt_protocol_util_1.assertNotificationFilterIsEmpty)(notificationFilter, this._onProtocolError, observer);
        this.write(request_message_1.default.init(userAgent, authToken), observer, true);
        return observer;
    };
    /**
     * Performs logoff of the underlying connection
     *
     * @param {Object} param
     * @param {function(err: Error)} param.onError the callback to invoke on error.
     * @param {function()} param.onComplete the callback to invoke on completion.
     * @param {boolean} param.flush whether to flush the buffered messages.
     *
     * @returns {StreamObserver} the stream observer that monitors the corresponding server response.
     */ BoltProtocol.prototype.logoff = function(_a) {
        var _b = _a === void 0 ? {} : _a, onComplete = _b.onComplete, onError = _b.onError, flush = _b.flush;
        var observer = new stream_observers_1.LogoffObserver({
            onCompleted: onComplete,
            onError: onError
        });
        // TODO: Verify the Neo4j version in the message
        var error = (0, neo4j_driver_core_1.newError)('Driver is connected to a database that does not support logoff. ' + 'Please upgrade to Neo4j 5.5.0 or later in order to use this functionality.');
        // unsupported API was used, consider this a fatal error for the current connection
        this._onProtocolError(error.message);
        observer.onError(error);
        throw error;
    };
    /**
     * Performs login of the underlying connection
     *
     * @param {Object} args
     * @param {Object} args.authToken the authentication token.
     * @param {function(err: Error)} args.onError the callback to invoke on error.
     * @param {function()} args.onComplete the callback to invoke on completion.
     * @param {boolean} args.flush whether to flush the buffered messages.
     *
     * @returns {StreamObserver} the stream observer that monitors the corresponding server response.
     */ BoltProtocol.prototype.logon = function(_a) {
        var _this = this;
        var _b = _a === void 0 ? {} : _a, authToken = _b.authToken, onComplete = _b.onComplete, onError = _b.onError, flush = _b.flush;
        var observer = new stream_observers_1.LoginObserver({
            onCompleted: function() {
                return _this._onLoginCompleted({}, authToken, onComplete);
            },
            onError: function(error) {
                return _this._onLoginError(error, onError);
            }
        });
        // TODO: Verify the Neo4j version in the message
        var error = (0, neo4j_driver_core_1.newError)('Driver is connected to a database that does not support logon. ' + 'Please upgrade to Neo4j 5.5.0 or later in order to use this functionality.');
        // unsupported API was used, consider this a fatal error for the current connection
        this._onProtocolError(error.message);
        observer.onError(error);
        throw error;
    };
    /**
     * Perform protocol related operations for closing this connection
     */ BoltProtocol.prototype.prepareToClose = function() {
    // no need to notify the database in this protocol version
    };
    /**
     * Begin an explicit transaction.
     * @param {Object} param
     * @param {Bookmarks} param.bookmarks the bookmarks.
     * @param {TxConfig} param.txConfig the configuration.
     * @param {string} param.database the target database name.
     * @param {string} param.mode the access mode.
     * @param {string} param.impersonatedUser the impersonated user
     * @param {NotificationFilter} param.notificationFilter the notification filter.
     * @param {function(err: Error)} param.beforeError the callback to invoke before handling the error.
     * @param {function(err: Error)} param.afterError the callback to invoke after handling the error.
     * @param {function()} param.beforeComplete the callback to invoke before handling the completion.
     * @param {function()} param.afterComplete the callback to invoke after handling the completion.
     * @returns {StreamObserver} the stream observer that monitors the corresponding server response.
     */ BoltProtocol.prototype.beginTransaction = function(_a) {
        var _b = _a === void 0 ? {} : _a, bookmarks = _b.bookmarks, txConfig = _b.txConfig, database = _b.database, mode = _b.mode, impersonatedUser = _b.impersonatedUser, notificationFilter = _b.notificationFilter, beforeError = _b.beforeError, afterError = _b.afterError, beforeComplete = _b.beforeComplete, afterComplete = _b.afterComplete;
        return this.run('BEGIN', bookmarks ? bookmarks.asBeginTransactionParameters() : {}, {
            bookmarks: bookmarks,
            txConfig: txConfig,
            database: database,
            mode: mode,
            impersonatedUser: impersonatedUser,
            notificationFilter: notificationFilter,
            beforeError: beforeError,
            afterError: afterError,
            beforeComplete: beforeComplete,
            afterComplete: afterComplete,
            flush: false
        });
    };
    /**
     * Commit the explicit transaction.
     * @param {Object} param
     * @param {function(err: Error)} param.beforeError the callback to invoke before handling the error.
     * @param {function(err: Error)} param.afterError the callback to invoke after handling the error.
     * @param {function()} param.beforeComplete the callback to invoke before handling the completion.
     * @param {function()} param.afterComplete the callback to invoke after handling the completion.
     * @returns {StreamObserver} the stream observer that monitors the corresponding server response.
     */ BoltProtocol.prototype.commitTransaction = function(_a) {
        var _b = _a === void 0 ? {} : _a, beforeError = _b.beforeError, afterError = _b.afterError, beforeComplete = _b.beforeComplete, afterComplete = _b.afterComplete;
        // WRITE access mode is used as a place holder here, it has
        // no effect on behaviour for Bolt V1 & V2
        return this.run('COMMIT', {}, {
            bookmarks: Bookmarks.empty(),
            txConfig: TxConfig.empty(),
            mode: ACCESS_MODE_WRITE,
            beforeError: beforeError,
            afterError: afterError,
            beforeComplete: beforeComplete,
            afterComplete: afterComplete
        });
    };
    /**
     * Rollback the explicit transaction.
     * @param {Object} param
     * @param {function(err: Error)} param.beforeError the callback to invoke before handling the error.
     * @param {function(err: Error)} param.afterError the callback to invoke after handling the error.
     * @param {function()} param.beforeComplete the callback to invoke before handling the completion.
     * @param {function()} param.afterComplete the callback to invoke after handling the completion.
     * @returns {StreamObserver} the stream observer that monitors the corresponding server response.
     */ BoltProtocol.prototype.rollbackTransaction = function(_a) {
        var _b = _a === void 0 ? {} : _a, beforeError = _b.beforeError, afterError = _b.afterError, beforeComplete = _b.beforeComplete, afterComplete = _b.afterComplete;
        // WRITE access mode is used as a place holder here, it has
        // no effect on behaviour for Bolt V1 & V2
        return this.run('ROLLBACK', {}, {
            bookmarks: Bookmarks.empty(),
            txConfig: TxConfig.empty(),
            mode: ACCESS_MODE_WRITE,
            beforeError: beforeError,
            afterError: afterError,
            beforeComplete: beforeComplete,
            afterComplete: afterComplete
        });
    };
    /**
     * Send a Cypher query through the underlying connection.
     * @param {string} query the cypher query.
     * @param {Object} parameters the query parameters.
     * @param {Object} param
     * @param {Bookmarks} param.bookmarks the bookmarks.
     * @param {TxConfig} param.txConfig the transaction configuration.
     * @param {string} param.database the target database name.
     * @param {string} param.impersonatedUser the impersonated user
     * @param {NotificationFilter} param.notificationFilter the notification filter.
     * @param {string} param.mode the access mode.
     * @param {function(keys: string[])} param.beforeKeys the callback to invoke before handling the keys.
     * @param {function(keys: string[])} param.afterKeys the callback to invoke after handling the keys.
     * @param {function(err: Error)} param.beforeError the callback to invoke before handling the error.
     * @param {function(err: Error)} param.afterError the callback to invoke after handling the error.
     * @param {function()} param.beforeComplete the callback to invoke before handling the completion.
     * @param {function()} param.afterComplete the callback to invoke after handling the completion.
     * @param {boolean} param.flush whether to flush the buffered messages.
     * @returns {StreamObserver} the stream observer that monitors the corresponding server response.
     */ BoltProtocol.prototype.run = function(query, parameters, _a) {
        var _b = _a === void 0 ? {} : _a, bookmarks = _b.bookmarks, txConfig = _b.txConfig, database = _b.database, mode = _b.mode, impersonatedUser = _b.impersonatedUser, notificationFilter = _b.notificationFilter, beforeKeys = _b.beforeKeys, afterKeys = _b.afterKeys, beforeError = _b.beforeError, afterError = _b.afterError, beforeComplete = _b.beforeComplete, afterComplete = _b.afterComplete, _c = _b.flush, flush = _c === void 0 ? true : _c, _d = _b.highRecordWatermark, highRecordWatermark = _d === void 0 ? Number.MAX_VALUE : _d, _e = _b.lowRecordWatermark, lowRecordWatermark = _e === void 0 ? Number.MAX_VALUE : _e;
        var observer = new stream_observers_1.ResultStreamObserver({
            server: this._server,
            beforeKeys: beforeKeys,
            afterKeys: afterKeys,
            beforeError: beforeError,
            afterError: afterError,
            beforeComplete: beforeComplete,
            afterComplete: afterComplete,
            highRecordWatermark: highRecordWatermark,
            lowRecordWatermark: lowRecordWatermark
        });
        // bookmarks and mode are ignored in this version of the protocol
        (0, bolt_protocol_util_1.assertTxConfigIsEmpty)(txConfig, this._onProtocolError, observer);
        // passing in a database name on this protocol version throws an error
        (0, bolt_protocol_util_1.assertDatabaseIsEmpty)(database, this._onProtocolError, observer);
        // passing impersonated user on this protocol version throws an error
        (0, bolt_protocol_util_1.assertImpersonatedUserIsEmpty)(impersonatedUser, this._onProtocolError, observer);
        // passing notification filter on this protocol version throws an error
        (0, bolt_protocol_util_1.assertNotificationFilterIsEmpty)(notificationFilter, this._onProtocolError, observer);
        this.write(request_message_1.default.run(query, parameters), observer, false);
        this.write(request_message_1.default.pullAll(), observer, flush);
        return observer;
    };
    Object.defineProperty(BoltProtocol.prototype, "currentFailure", {
        get: function() {
            return this._responseHandler.currentFailure;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Send a RESET through the underlying connection.
     * @param {Object} param
     * @param {function(err: Error)} param.onError the callback to invoke on error.
     * @param {function()} param.onComplete the callback to invoke on completion.
     * @returns {StreamObserver} the stream observer that monitors the corresponding server response.
     */ BoltProtocol.prototype.reset = function(_a) {
        var _b = _a === void 0 ? {} : _a, onError = _b.onError, onComplete = _b.onComplete;
        var observer = new stream_observers_1.ResetObserver({
            onProtocolError: this._onProtocolError,
            onError: onError,
            onComplete: onComplete
        });
        this.write(request_message_1.default.reset(), observer, true);
        return observer;
    };
    /**
     * Send a TELEMETRY through the underlying connection.
     *
     * @param {object} param0 Message params
     * @param {number} param0.api The API called
     * @param {object} param1 Configuration and callbacks
     * @param {function()} param1.onCompleted Called when completed
     * @param {function()} param1.onError Called when error
     * @return {StreamObserver} the stream observer that monitors the corresponding server response.
     */ BoltProtocol.prototype.telemetry = function(_a, _b) {
        var api = _a.api;
        var _c = _b === void 0 ? {} : _b, onError = _c.onError, onCompleted = _c.onCompleted;
        var observer = new stream_observers_1.CompletedObserver();
        if (onCompleted) {
            onCompleted();
        }
        return observer;
    };
    BoltProtocol.prototype._createPacker = function(chunker) {
        return new packstream_1.v1.Packer(chunker);
    };
    BoltProtocol.prototype._createUnpacker = function(disableLosslessIntegers, useBigInt) {
        return new packstream_1.v1.Unpacker(disableLosslessIntegers, useBigInt);
    };
    /**
     * Write a message to the network channel.
     * @param {RequestMessage} message the message to write.
     * @param {StreamObserver} observer the response observer.
     * @param {boolean} flush `true` if flush should happen after the message is written to the buffer.
     */ BoltProtocol.prototype.write = function(message, observer, flush) {
        this._lastMessageSignature = message.signature;
        var messageStruct = new packstream_1.structure.Structure(message.signature, message.fields);
        this.packable(messageStruct)();
        var queued = this.queueObserverIfProtocolIsNotBroken(observer);
        if (queued) {
            if (this._log.isDebugEnabled()) {
                this._log.debug("C: ".concat(message));
            }
            this._chunker.messageBoundary();
            if (flush) {
                this._chunker.flush();
            }
        }
    };
    BoltProtocol.prototype.isLastMessageLogon = function() {
        return this._lastMessageSignature === request_message_1.SIGNATURES.HELLO || this._lastMessageSignature === request_message_1.SIGNATURES.LOGON;
    };
    BoltProtocol.prototype.isLastMessageReset = function() {
        return this._lastMessageSignature === request_message_1.SIGNATURES.RESET;
    };
    /**
     * Notifies faltal erros to the observers and mark the protocol in the fatal error state.
     * @param {Error} error The error
     */ BoltProtocol.prototype.notifyFatalError = function(error) {
        this._fatalError = error;
        return this._responseHandler._notifyErrorToObservers(error);
    };
    /**
     * Updates the the current observer with the next one on the queue.
     */ BoltProtocol.prototype.updateCurrentObserver = function() {
        return this._responseHandler._updateCurrentObserver();
    };
    /**
     * Checks if exist an ongoing observable requests
     * @return {boolean}
     */ BoltProtocol.prototype.hasOngoingObservableRequests = function() {
        return this._responseHandler.hasOngoingObservableRequests();
    };
    /**
     * Enqueue the observer if the protocol is not broken.
     * In case it's broken, the observer will be notified about the error.
     *
     * @param {StreamObserver} observer The observer
     * @returns {boolean} if it was queued
     */ BoltProtocol.prototype.queueObserverIfProtocolIsNotBroken = function(observer) {
        if (this.isBroken()) {
            this.notifyFatalErrorToObserver(observer);
            return false;
        }
        return this._responseHandler._queueObserver(observer);
    };
    /**
     * Veritfy the protocol is not broken.
     * @returns {boolean}
     */ BoltProtocol.prototype.isBroken = function() {
        return !!this._fatalError;
    };
    /**
     * Notifies the current fatal error to the observer
     *
     * @param {StreamObserver} observer The observer
     */ BoltProtocol.prototype.notifyFatalErrorToObserver = function(observer) {
        if (observer && observer.onError) {
            observer.onError(this._fatalError);
        }
    };
    /**
     * Reset current failure on the observable response handler to null.
     */ BoltProtocol.prototype.resetFailure = function() {
        this._responseHandler._resetFailure();
    };
    BoltProtocol.prototype._onLoginCompleted = function(metadata, authToken, onCompleted) {
        this._initialized = true;
        this._authToken = authToken;
        if (metadata) {
            var serverVersion = metadata.server;
            if (!this._server.version) {
                this._server.version = serverVersion;
            }
        }
        if (onCompleted) {
            onCompleted(metadata);
        }
    };
    BoltProtocol.prototype._onLoginError = function(error, onError) {
        this._onProtocolError(error.message);
        if (onError) {
            onError(error);
        }
    };
    return BoltProtocol;
}();
exports.default = BoltProtocol;
}),
"[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/temporal-factory.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.epochDayToDate = epochDayToDate;
exports.nanoOfDayToLocalTime = nanoOfDayToLocalTime;
exports.epochSecondAndNanoToLocalDateTime = epochSecondAndNanoToLocalDateTime;
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
 */ var neo4j_driver_core_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/index.js [app-route] (ecmascript)");
var _a = neo4j_driver_core_1.internal.temporalUtil, DAYS_0000_TO_1970 = _a.DAYS_0000_TO_1970, DAYS_PER_400_YEAR_CYCLE = _a.DAYS_PER_400_YEAR_CYCLE, NANOS_PER_HOUR = _a.NANOS_PER_HOUR, NANOS_PER_MINUTE = _a.NANOS_PER_MINUTE, NANOS_PER_SECOND = _a.NANOS_PER_SECOND, SECONDS_PER_DAY = _a.SECONDS_PER_DAY, floorDiv = _a.floorDiv, floorMod = _a.floorMod;
/**
 * Converts given epoch day to a local date.
 * @param {Integer|number|string} epochDay the epoch day to convert.
 * @return {Date} the date representing the epoch day in years, months and days.
 */ function epochDayToDate(epochDay) {
    epochDay = (0, neo4j_driver_core_1.int)(epochDay);
    var zeroDay = epochDay.add(DAYS_0000_TO_1970).subtract(60);
    var adjust = (0, neo4j_driver_core_1.int)(0);
    if (zeroDay.lessThan(0)) {
        var adjustCycles = zeroDay.add(1).div(DAYS_PER_400_YEAR_CYCLE).subtract(1);
        adjust = adjustCycles.multiply(400);
        zeroDay = zeroDay.add(adjustCycles.multiply(-DAYS_PER_400_YEAR_CYCLE));
    }
    var year = zeroDay.multiply(400).add(591).div(DAYS_PER_400_YEAR_CYCLE);
    var dayOfYearEst = zeroDay.subtract(year.multiply(365).add(year.div(4)).subtract(year.div(100)).add(year.div(400)));
    if (dayOfYearEst.lessThan(0)) {
        year = year.subtract(1);
        dayOfYearEst = zeroDay.subtract(year.multiply(365).add(year.div(4)).subtract(year.div(100)).add(year.div(400)));
    }
    year = year.add(adjust);
    var marchDayOfYear = dayOfYearEst;
    var marchMonth = marchDayOfYear.multiply(5).add(2).div(153);
    var month = marchMonth.add(2).modulo(12).add(1);
    var day = marchDayOfYear.subtract(marchMonth.multiply(306).add(5).div(10)).add(1);
    year = year.add(marchMonth.div(10));
    return new neo4j_driver_core_1.Date(year, month, day);
}
/**
 * Converts nanoseconds of the day into local time.
 * @param {Integer|number|string} nanoOfDay the nanoseconds of the day to convert.
 * @return {LocalTime} the local time representing given nanoseconds of the day.
 */ function nanoOfDayToLocalTime(nanoOfDay) {
    nanoOfDay = (0, neo4j_driver_core_1.int)(nanoOfDay);
    var hour = nanoOfDay.div(NANOS_PER_HOUR);
    nanoOfDay = nanoOfDay.subtract(hour.multiply(NANOS_PER_HOUR));
    var minute = nanoOfDay.div(NANOS_PER_MINUTE);
    nanoOfDay = nanoOfDay.subtract(minute.multiply(NANOS_PER_MINUTE));
    var second = nanoOfDay.div(NANOS_PER_SECOND);
    var nanosecond = nanoOfDay.subtract(second.multiply(NANOS_PER_SECOND));
    return new neo4j_driver_core_1.LocalTime(hour, minute, second, nanosecond);
}
/**
 * Converts given epoch second and nanosecond adjustment into a local date time object.
 * @param {Integer|number|string} epochSecond the epoch second to use.
 * @param {Integer|number|string} nano the nanosecond to use.
 * @return {LocalDateTime} the local date time representing given epoch second and nano.
 */ function epochSecondAndNanoToLocalDateTime(epochSecond, nano) {
    var epochDay = floorDiv(epochSecond, SECONDS_PER_DAY);
    var secondsOfDay = floorMod(epochSecond, SECONDS_PER_DAY);
    var nanoOfDay = secondsOfDay.multiply(NANOS_PER_SECOND).add(nano);
    var localDate = epochDayToDate(epochDay);
    var localTime = nanoOfDayToLocalTime(nanoOfDay);
    return new neo4j_driver_core_1.LocalDateTime(localDate.year, localDate.month, localDate.day, localTime.hour, localTime.minute, localTime.second, localTime.nanosecond);
}
}),
"[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/bolt-protocol-v2.transformer.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
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
var __importDefault = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : {
        "default": mod
    };
};
Object.defineProperty(exports, "__esModule", {
    value: true
});
var neo4j_driver_core_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/index.js [app-route] (ecmascript)");
var packstream_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/packstream/index.js [app-route] (ecmascript)");
var transformer_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/transformer.js [app-route] (ecmascript)");
var temporal_factory_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/temporal-factory.js [app-route] (ecmascript)");
var bolt_protocol_v1_transformer_1 = __importDefault(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/bolt-protocol-v1.transformer.js [app-route] (ecmascript)"));
var _a = neo4j_driver_core_1.internal.temporalUtil, dateToEpochDay = _a.dateToEpochDay, localDateTimeToEpochSecond = _a.localDateTimeToEpochSecond, localTimeToNanoOfDay = _a.localTimeToNanoOfDay;
var POINT_2D = 0x58;
var POINT_2D_STRUCT_SIZE = 3;
var POINT_3D = 0x59;
var POINT_3D_STRUCT_SIZE = 4;
var DURATION = 0x45;
var DURATION_STRUCT_SIZE = 4;
var LOCAL_TIME = 0x74;
var LOCAL_TIME_STRUCT_SIZE = 1;
var TIME = 0x54;
var TIME_STRUCT_SIZE = 2;
var DATE = 0x44;
var DATE_STRUCT_SIZE = 1;
var LOCAL_DATE_TIME = 0x64;
var LOCAL_DATE_TIME_STRUCT_SIZE = 2;
var DATE_TIME_WITH_ZONE_OFFSET = 0x46;
var DATE_TIME_WITH_ZONE_OFFSET_STRUCT_SIZE = 3;
var DATE_TIME_WITH_ZONE_ID = 0x66;
var DATE_TIME_WITH_ZONE_ID_STRUCT_SIZE = 3;
/**
 * Creates the Point2D Transformer
 * @returns {TypeTransformer}
 */ function createPoint2DTransformer() {
    return new transformer_1.TypeTransformer({
        signature: POINT_2D,
        isTypeInstance: function(point) {
            return (0, neo4j_driver_core_1.isPoint)(point) && (point.z === null || point.z === undefined);
        },
        toStructure: function(point) {
            return new packstream_1.structure.Structure(POINT_2D, [
                (0, neo4j_driver_core_1.int)(point.srid),
                point.x,
                point.y
            ]);
        },
        fromStructure: function(struct) {
            packstream_1.structure.verifyStructSize('Point2D', POINT_2D_STRUCT_SIZE, struct.size);
            var _a = __read(struct.fields, 3), srid = _a[0], x = _a[1], y = _a[2];
            return new neo4j_driver_core_1.Point(srid, x, y, undefined // z
            );
        }
    });
}
/**
 * Creates the Point3D Transformer
 * @returns {TypeTransformer}
 */ function createPoint3DTransformer() {
    return new transformer_1.TypeTransformer({
        signature: POINT_3D,
        isTypeInstance: function(point) {
            return (0, neo4j_driver_core_1.isPoint)(point) && point.z !== null && point.z !== undefined;
        },
        toStructure: function(point) {
            return new packstream_1.structure.Structure(POINT_3D, [
                (0, neo4j_driver_core_1.int)(point.srid),
                point.x,
                point.y,
                point.z
            ]);
        },
        fromStructure: function(struct) {
            packstream_1.structure.verifyStructSize('Point3D', POINT_3D_STRUCT_SIZE, struct.size);
            var _a = __read(struct.fields, 4), srid = _a[0], x = _a[1], y = _a[2], z = _a[3];
            return new neo4j_driver_core_1.Point(srid, x, y, z);
        }
    });
}
/**
 * Creates the Duration Transformer
 * @returns {TypeTransformer}
 */ function createDurationTransformer() {
    return new transformer_1.TypeTransformer({
        signature: DURATION,
        isTypeInstance: neo4j_driver_core_1.isDuration,
        toStructure: function(value) {
            var months = (0, neo4j_driver_core_1.int)(value.months);
            var days = (0, neo4j_driver_core_1.int)(value.days);
            var seconds = (0, neo4j_driver_core_1.int)(value.seconds);
            var nanoseconds = (0, neo4j_driver_core_1.int)(value.nanoseconds);
            return new packstream_1.structure.Structure(DURATION, [
                months,
                days,
                seconds,
                nanoseconds
            ]);
        },
        fromStructure: function(struct) {
            packstream_1.structure.verifyStructSize('Duration', DURATION_STRUCT_SIZE, struct.size);
            var _a = __read(struct.fields, 4), months = _a[0], days = _a[1], seconds = _a[2], nanoseconds = _a[3];
            return new neo4j_driver_core_1.Duration(months, days, seconds, nanoseconds);
        }
    });
}
/**
 * Creates the LocalTime Transformer
 * @param {Object} param
 * @param {boolean} param.disableLosslessIntegers Disables lossless integers
 * @param {boolean} param.useBigInt Uses BigInt instead of number or Integer
 * @returns {TypeTransformer}
 */ function createLocalTimeTransformer(_a) {
    var disableLosslessIntegers = _a.disableLosslessIntegers, useBigInt = _a.useBigInt;
    return new transformer_1.TypeTransformer({
        signature: LOCAL_TIME,
        isTypeInstance: neo4j_driver_core_1.isLocalTime,
        toStructure: function(value) {
            var nanoOfDay = localTimeToNanoOfDay(value.hour, value.minute, value.second, value.nanosecond);
            return new packstream_1.structure.Structure(LOCAL_TIME, [
                nanoOfDay
            ]);
        },
        fromStructure: function(struct) {
            packstream_1.structure.verifyStructSize('LocalTime', LOCAL_TIME_STRUCT_SIZE, struct.size);
            var _a = __read(struct.fields, 1), nanoOfDay = _a[0];
            var result = (0, temporal_factory_1.nanoOfDayToLocalTime)(nanoOfDay);
            return convertIntegerPropsIfNeeded(result, disableLosslessIntegers, useBigInt);
        }
    });
}
/**
 * Creates the Time Transformer
 * @param {Object} param
 * @param {boolean} param.disableLosslessIntegers Disables lossless integers
 * @param {boolean} param.useBigInt Uses BigInt instead of number or Integer
 * @returns {TypeTransformer}
 */ function createTimeTransformer(_a) {
    var disableLosslessIntegers = _a.disableLosslessIntegers, useBigInt = _a.useBigInt;
    return new transformer_1.TypeTransformer({
        signature: TIME,
        isTypeInstance: neo4j_driver_core_1.isTime,
        toStructure: function(value) {
            var nanoOfDay = localTimeToNanoOfDay(value.hour, value.minute, value.second, value.nanosecond);
            var offsetSeconds = (0, neo4j_driver_core_1.int)(value.timeZoneOffsetSeconds);
            return new packstream_1.structure.Structure(TIME, [
                nanoOfDay,
                offsetSeconds
            ]);
        },
        fromStructure: function(struct) {
            packstream_1.structure.verifyStructSize('Time', TIME_STRUCT_SIZE, struct.size);
            var _a = __read(struct.fields, 2), nanoOfDay = _a[0], offsetSeconds = _a[1];
            var localTime = (0, temporal_factory_1.nanoOfDayToLocalTime)(nanoOfDay);
            var result = new neo4j_driver_core_1.Time(localTime.hour, localTime.minute, localTime.second, localTime.nanosecond, offsetSeconds);
            return convertIntegerPropsIfNeeded(result, disableLosslessIntegers, useBigInt);
        }
    });
}
/**
 * Creates the Date Transformer
 * @param {Object} param
 * @param {boolean} param.disableLosslessIntegers Disables lossless integers
 * @param {boolean} param.useBigInt Uses BigInt instead of number or Integer
 * @returns {TypeTransformer}
 */ function createDateTransformer(_a) {
    var disableLosslessIntegers = _a.disableLosslessIntegers, useBigInt = _a.useBigInt;
    return new transformer_1.TypeTransformer({
        signature: DATE,
        isTypeInstance: neo4j_driver_core_1.isDate,
        toStructure: function(value) {
            var epochDay = dateToEpochDay(value.year, value.month, value.day);
            return new packstream_1.structure.Structure(DATE, [
                epochDay
            ]);
        },
        fromStructure: function(struct) {
            packstream_1.structure.verifyStructSize('Date', DATE_STRUCT_SIZE, struct.size);
            var _a = __read(struct.fields, 1), epochDay = _a[0];
            var result = (0, temporal_factory_1.epochDayToDate)(epochDay);
            return convertIntegerPropsIfNeeded(result, disableLosslessIntegers, useBigInt);
        }
    });
}
/**
 * Creates the LocalDateTime Transformer
 * @param {Object} param
 * @param {boolean} param.disableLosslessIntegers Disables lossless integers
 * @param {boolean} param.useBigInt Uses BigInt instead of number or Integer
 * @returns {TypeTransformer}
 */ function createLocalDateTimeTransformer(_a) {
    var disableLosslessIntegers = _a.disableLosslessIntegers, useBigInt = _a.useBigInt;
    return new transformer_1.TypeTransformer({
        signature: LOCAL_DATE_TIME,
        isTypeInstance: neo4j_driver_core_1.isLocalDateTime,
        toStructure: function(value) {
            var epochSecond = localDateTimeToEpochSecond(value.year, value.month, value.day, value.hour, value.minute, value.second, value.nanosecond);
            var nano = (0, neo4j_driver_core_1.int)(value.nanosecond);
            return new packstream_1.structure.Structure(LOCAL_DATE_TIME, [
                epochSecond,
                nano
            ]);
        },
        fromStructure: function(struct) {
            packstream_1.structure.verifyStructSize('LocalDateTime', LOCAL_DATE_TIME_STRUCT_SIZE, struct.size);
            var _a = __read(struct.fields, 2), epochSecond = _a[0], nano = _a[1];
            var result = (0, temporal_factory_1.epochSecondAndNanoToLocalDateTime)(epochSecond, nano);
            return convertIntegerPropsIfNeeded(result, disableLosslessIntegers, useBigInt);
        }
    });
}
/**
 * Creates the DateTime with ZoneId Transformer
 * @param {Object} param
 * @param {boolean} param.disableLosslessIntegers Disables lossless integers
 * @param {boolean} param.useBigInt Uses BigInt instead of number or Integer
 * @returns {TypeTransformer}
 */ function createDateTimeWithZoneIdTransformer(_a) {
    var disableLosslessIntegers = _a.disableLosslessIntegers, useBigInt = _a.useBigInt;
    return new transformer_1.TypeTransformer({
        signature: DATE_TIME_WITH_ZONE_ID,
        isTypeInstance: function(object) {
            return (0, neo4j_driver_core_1.isDateTime)(object) && object.timeZoneId != null;
        },
        toStructure: function(value) {
            var epochSecond = localDateTimeToEpochSecond(value.year, value.month, value.day, value.hour, value.minute, value.second, value.nanosecond);
            var nano = (0, neo4j_driver_core_1.int)(value.nanosecond);
            var timeZoneId = value.timeZoneId;
            return new packstream_1.structure.Structure(DATE_TIME_WITH_ZONE_ID, [
                epochSecond,
                nano,
                timeZoneId
            ]);
        },
        fromStructure: function(struct) {
            packstream_1.structure.verifyStructSize('DateTimeWithZoneId', DATE_TIME_WITH_ZONE_ID_STRUCT_SIZE, struct.size);
            var _a = __read(struct.fields, 3), epochSecond = _a[0], nano = _a[1], timeZoneId = _a[2];
            var localDateTime = (0, temporal_factory_1.epochSecondAndNanoToLocalDateTime)(epochSecond, nano);
            var result = new neo4j_driver_core_1.DateTime(localDateTime.year, localDateTime.month, localDateTime.day, localDateTime.hour, localDateTime.minute, localDateTime.second, localDateTime.nanosecond, null, timeZoneId);
            return convertIntegerPropsIfNeeded(result, disableLosslessIntegers, useBigInt);
        }
    });
}
/**
 * Creates the DateTime with Offset Transformer
 * @param {Object} param
 * @param {boolean} param.disableLosslessIntegers Disables lossless integers
 * @param {boolean} param.useBigInt Uses BigInt instead of number or Integer
 * @returns {TypeTransformer}
 */ function createDateTimeWithOffsetTransformer(_a) {
    var disableLosslessIntegers = _a.disableLosslessIntegers, useBigInt = _a.useBigInt;
    return new transformer_1.TypeTransformer({
        signature: DATE_TIME_WITH_ZONE_OFFSET,
        isTypeInstance: function(object) {
            return (0, neo4j_driver_core_1.isDateTime)(object) && object.timeZoneId == null;
        },
        toStructure: function(value) {
            var epochSecond = localDateTimeToEpochSecond(value.year, value.month, value.day, value.hour, value.minute, value.second, value.nanosecond);
            var nano = (0, neo4j_driver_core_1.int)(value.nanosecond);
            var timeZoneOffsetSeconds = (0, neo4j_driver_core_1.int)(value.timeZoneOffsetSeconds);
            return new packstream_1.structure.Structure(DATE_TIME_WITH_ZONE_OFFSET, [
                epochSecond,
                nano,
                timeZoneOffsetSeconds
            ]);
        },
        fromStructure: function(struct) {
            packstream_1.structure.verifyStructSize('DateTimeWithZoneOffset', DATE_TIME_WITH_ZONE_OFFSET_STRUCT_SIZE, struct.size);
            var _a = __read(struct.fields, 3), epochSecond = _a[0], nano = _a[1], timeZoneOffsetSeconds = _a[2];
            var localDateTime = (0, temporal_factory_1.epochSecondAndNanoToLocalDateTime)(epochSecond, nano);
            var result = new neo4j_driver_core_1.DateTime(localDateTime.year, localDateTime.month, localDateTime.day, localDateTime.hour, localDateTime.minute, localDateTime.second, localDateTime.nanosecond, timeZoneOffsetSeconds, null);
            return convertIntegerPropsIfNeeded(result, disableLosslessIntegers, useBigInt);
        }
    });
}
function convertIntegerPropsIfNeeded(obj, disableLosslessIntegers, useBigInt) {
    if (!disableLosslessIntegers && !useBigInt) {
        return obj;
    }
    var convert = function(value) {
        return useBigInt ? value.toBigInt() : value.toNumberOrInfinity();
    };
    var clone = Object.create(Object.getPrototypeOf(obj));
    for(var prop in obj){
        if (Object.prototype.hasOwnProperty.call(obj, prop) === true) {
            var value = obj[prop];
            clone[prop] = (0, neo4j_driver_core_1.isInt)(value) ? convert(value) : value;
        }
    }
    Object.freeze(clone);
    return clone;
}
exports.default = __assign(__assign({}, bolt_protocol_v1_transformer_1.default), {
    createPoint2DTransformer: createPoint2DTransformer,
    createPoint3DTransformer: createPoint3DTransformer,
    createDurationTransformer: createDurationTransformer,
    createLocalTimeTransformer: createLocalTimeTransformer,
    createTimeTransformer: createTimeTransformer,
    createDateTransformer: createDateTransformer,
    createLocalDateTimeTransformer: createLocalDateTimeTransformer,
    createDateTimeWithZoneIdTransformer: createDateTimeWithZoneIdTransformer,
    createDateTimeWithOffsetTransformer: createDateTimeWithOffsetTransformer
});
}),
"[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/bolt-protocol-v2.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
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
var __importDefault = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : {
        "default": mod
    };
};
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
 */ var bolt_protocol_v1_1 = __importDefault(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/bolt-protocol-v1.js [app-route] (ecmascript)"));
var packstream_1 = __importDefault(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/packstream/index.js [app-route] (ecmascript)"));
var neo4j_driver_core_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/index.js [app-route] (ecmascript)");
var bolt_protocol_v2_transformer_1 = __importDefault(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/bolt-protocol-v2.transformer.js [app-route] (ecmascript)"));
var transformer_1 = __importDefault(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/transformer.js [app-route] (ecmascript)"));
var BOLT_PROTOCOL_V2 = neo4j_driver_core_1.internal.constants.BOLT_PROTOCOL_V2;
var BoltProtocol = function(_super) {
    __extends(BoltProtocol, _super);
    function BoltProtocol() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    BoltProtocol.prototype._createPacker = function(chunker) {
        return new packstream_1.default.Packer(chunker);
    };
    BoltProtocol.prototype._createUnpacker = function(disableLosslessIntegers, useBigInt) {
        return new packstream_1.default.Unpacker(disableLosslessIntegers, useBigInt);
    };
    Object.defineProperty(BoltProtocol.prototype, "transformer", {
        get: function() {
            var _this = this;
            if (this._transformer === undefined) {
                this._transformer = new transformer_1.default(Object.values(bolt_protocol_v2_transformer_1.default).map(function(create) {
                    return create(_this._config, _this._log);
                }));
            }
            return this._transformer;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BoltProtocol.prototype, "version", {
        get: function() {
            return BOLT_PROTOCOL_V2;
        },
        enumerable: false,
        configurable: true
    });
    return BoltProtocol;
}(bolt_protocol_v1_1.default);
exports.default = BoltProtocol;
}),
"[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/bolt-protocol-v3.transformer.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
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
var __importDefault = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : {
        "default": mod
    };
};
Object.defineProperty(exports, "__esModule", {
    value: true
});
var bolt_protocol_v2_transformer_1 = __importDefault(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/bolt-protocol-v2.transformer.js [app-route] (ecmascript)"));
exports.default = __assign({}, bolt_protocol_v2_transformer_1.default);
}),
"[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/bolt-protocol-v3.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
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
 */ var bolt_protocol_v2_1 = __importDefault(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/bolt-protocol-v2.js [app-route] (ecmascript)"));
var request_message_1 = __importDefault(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/request-message.js [app-route] (ecmascript)"));
var bolt_protocol_util_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/bolt-protocol-util.js [app-route] (ecmascript)");
var stream_observers_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/stream-observers.js [app-route] (ecmascript)");
var bolt_protocol_v3_transformer_1 = __importDefault(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/bolt-protocol-v3.transformer.js [app-route] (ecmascript)"));
var transformer_1 = __importDefault(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/transformer.js [app-route] (ecmascript)"));
var neo4j_driver_core_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/index.js [app-route] (ecmascript)");
var Bookmarks = neo4j_driver_core_1.internal.bookmarks.Bookmarks, BOLT_PROTOCOL_V3 = neo4j_driver_core_1.internal.constants.BOLT_PROTOCOL_V3, TxConfig = neo4j_driver_core_1.internal.txConfig.TxConfig;
var CONTEXT = 'context';
var CALL_GET_ROUTING_TABLE = "CALL dbms.cluster.routing.getRoutingTable($".concat(CONTEXT, ")");
var noOpObserver = new stream_observers_1.StreamObserver();
var BoltProtocol = function(_super) {
    __extends(BoltProtocol, _super);
    function BoltProtocol() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(BoltProtocol.prototype, "version", {
        get: function() {
            return BOLT_PROTOCOL_V3;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BoltProtocol.prototype, "transformer", {
        get: function() {
            var _this = this;
            if (this._transformer === undefined) {
                this._transformer = new transformer_1.default(Object.values(bolt_protocol_v3_transformer_1.default).map(function(create) {
                    return create(_this._config, _this._log);
                }));
            }
            return this._transformer;
        },
        enumerable: false,
        configurable: true
    });
    BoltProtocol.prototype.transformMetadata = function(metadata) {
        if ('t_first' in metadata) {
            // Bolt V3 uses shorter key 't_first' to represent 'result_available_after'
            // adjust the key to be the same as in Bolt V1 so that ResultSummary can retrieve the value
            metadata.result_available_after = metadata.t_first;
            delete metadata.t_first;
        }
        if ('t_last' in metadata) {
            // Bolt V3 uses shorter key 't_last' to represent 'result_consumed_after'
            // adjust the key to be the same as in Bolt V1 so that ResultSummary can retrieve the value
            metadata.result_consumed_after = metadata.t_last;
            delete metadata.t_last;
        }
        return metadata;
    };
    BoltProtocol.prototype.initialize = function(_a) {
        var _this = this;
        var _b = _a === void 0 ? {} : _a, userAgent = _b.userAgent, boltAgent = _b.boltAgent, authToken = _b.authToken, notificationFilter = _b.notificationFilter, onError = _b.onError, onComplete = _b.onComplete;
        var observer = new stream_observers_1.LoginObserver({
            onError: function(error) {
                return _this._onLoginError(error, onError);
            },
            onCompleted: function(metadata) {
                return _this._onLoginCompleted(metadata, authToken, onComplete);
            }
        });
        // passing notification filter on this protocol version throws an error
        (0, bolt_protocol_util_1.assertNotificationFilterIsEmpty)(notificationFilter, this._onProtocolError, observer);
        this.write(request_message_1.default.hello(userAgent, authToken), observer, true);
        return observer;
    };
    BoltProtocol.prototype.prepareToClose = function() {
        this.write(request_message_1.default.goodbye(), noOpObserver, true);
    };
    BoltProtocol.prototype.beginTransaction = function(_a) {
        var _b = _a === void 0 ? {} : _a, bookmarks = _b.bookmarks, txConfig = _b.txConfig, database = _b.database, impersonatedUser = _b.impersonatedUser, notificationFilter = _b.notificationFilter, mode = _b.mode, beforeError = _b.beforeError, afterError = _b.afterError, beforeComplete = _b.beforeComplete, afterComplete = _b.afterComplete;
        var observer = new stream_observers_1.ResultStreamObserver({
            server: this._server,
            beforeError: beforeError,
            afterError: afterError,
            beforeComplete: beforeComplete,
            afterComplete: afterComplete
        });
        observer.prepareToHandleSingleResponse();
        // passing in a database name on this protocol version throws an error
        (0, bolt_protocol_util_1.assertDatabaseIsEmpty)(database, this._onProtocolError, observer);
        // passing impersonated user on this protocol version throws an error
        (0, bolt_protocol_util_1.assertImpersonatedUserIsEmpty)(impersonatedUser, this._onProtocolError, observer);
        // passing notification filter on this protocol version throws an error
        (0, bolt_protocol_util_1.assertNotificationFilterIsEmpty)(notificationFilter, this._onProtocolError, observer);
        this.write(request_message_1.default.begin({
            bookmarks: bookmarks,
            txConfig: txConfig,
            mode: mode
        }), observer, true);
        return observer;
    };
    BoltProtocol.prototype.commitTransaction = function(_a) {
        var _b = _a === void 0 ? {} : _a, beforeError = _b.beforeError, afterError = _b.afterError, beforeComplete = _b.beforeComplete, afterComplete = _b.afterComplete;
        var observer = new stream_observers_1.ResultStreamObserver({
            server: this._server,
            beforeError: beforeError,
            afterError: afterError,
            beforeComplete: beforeComplete,
            afterComplete: afterComplete
        });
        observer.prepareToHandleSingleResponse();
        this.write(request_message_1.default.commit(), observer, true);
        return observer;
    };
    BoltProtocol.prototype.rollbackTransaction = function(_a) {
        var _b = _a === void 0 ? {} : _a, beforeError = _b.beforeError, afterError = _b.afterError, beforeComplete = _b.beforeComplete, afterComplete = _b.afterComplete;
        var observer = new stream_observers_1.ResultStreamObserver({
            server: this._server,
            beforeError: beforeError,
            afterError: afterError,
            beforeComplete: beforeComplete,
            afterComplete: afterComplete
        });
        observer.prepareToHandleSingleResponse();
        this.write(request_message_1.default.rollback(), observer, true);
        return observer;
    };
    BoltProtocol.prototype.run = function(query, parameters, _a) {
        var _b = _a === void 0 ? {} : _a, bookmarks = _b.bookmarks, txConfig = _b.txConfig, database = _b.database, impersonatedUser = _b.impersonatedUser, notificationFilter = _b.notificationFilter, mode = _b.mode, beforeKeys = _b.beforeKeys, afterKeys = _b.afterKeys, beforeError = _b.beforeError, afterError = _b.afterError, beforeComplete = _b.beforeComplete, afterComplete = _b.afterComplete, _c = _b.flush, flush = _c === void 0 ? true : _c, _d = _b.highRecordWatermark, highRecordWatermark = _d === void 0 ? Number.MAX_VALUE : _d, _e = _b.lowRecordWatermark, lowRecordWatermark = _e === void 0 ? Number.MAX_VALUE : _e;
        var observer = new stream_observers_1.ResultStreamObserver({
            server: this._server,
            beforeKeys: beforeKeys,
            afterKeys: afterKeys,
            beforeError: beforeError,
            afterError: afterError,
            beforeComplete: beforeComplete,
            afterComplete: afterComplete,
            highRecordWatermark: highRecordWatermark,
            lowRecordWatermark: lowRecordWatermark
        });
        // passing in a database name on this protocol version throws an error
        (0, bolt_protocol_util_1.assertDatabaseIsEmpty)(database, this._onProtocolError, observer);
        // passing impersonated user on this protocol version throws an error
        (0, bolt_protocol_util_1.assertImpersonatedUserIsEmpty)(impersonatedUser, this._onProtocolError, observer);
        // passing notification filter on this protocol version throws an error
        (0, bolt_protocol_util_1.assertNotificationFilterIsEmpty)(notificationFilter, this._onProtocolError, observer);
        this.write(request_message_1.default.runWithMetadata(query, parameters, {
            bookmarks: bookmarks,
            txConfig: txConfig,
            mode: mode
        }), observer, false);
        this.write(request_message_1.default.pullAll(), observer, flush);
        return observer;
    };
    /**
     * Request routing information
     *
     * @param {Object} param -
     * @param {object} param.routingContext The routing context used to define the routing table.
     *  Multi-datacenter deployments is one of its use cases
     * @param {string} param.databaseName The database name
     * @param {Bookmarks} params.sessionContext.bookmarks The bookmarks used for requesting the routing table
     * @param {string} params.sessionContext.mode The session mode
     * @param {string} params.sessionContext.database The database name used on the session
     * @param {function()} params.sessionContext.afterComplete The session param used after the session closed
     * @param {function(err: Error)} param.onError
     * @param {function(RawRoutingTable)} param.onCompleted
     * @returns {RouteObserver} the route observer
     */ BoltProtocol.prototype.requestRoutingInformation = function(_a) {
        var _b;
        var _c = _a.routingContext, routingContext = _c === void 0 ? {} : _c, _d = _a.sessionContext, sessionContext = _d === void 0 ? {} : _d, onError = _a.onError, onCompleted = _a.onCompleted;
        var resultObserver = this.run(CALL_GET_ROUTING_TABLE, (_b = {}, _b[CONTEXT] = routingContext, _b), __assign(__assign({}, sessionContext), {
            txConfig: TxConfig.empty()
        }));
        return new stream_observers_1.ProcedureRouteObserver({
            resultObserver: resultObserver,
            onProtocolError: this._onProtocolError,
            onError: onError,
            onCompleted: onCompleted
        });
    };
    return BoltProtocol;
}(bolt_protocol_v2_1.default);
exports.default = BoltProtocol;
}),
"[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/bolt-protocol-v4x0.transformer.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
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
var __importDefault = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : {
        "default": mod
    };
};
Object.defineProperty(exports, "__esModule", {
    value: true
});
var bolt_protocol_v3_transformer_1 = __importDefault(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/bolt-protocol-v3.transformer.js [app-route] (ecmascript)"));
exports.default = __assign({}, bolt_protocol_v3_transformer_1.default);
}),
"[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/bolt-protocol-v4x0.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
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
 */ var bolt_protocol_v3_1 = __importDefault(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/bolt-protocol-v3.js [app-route] (ecmascript)"));
var request_message_1 = __importDefault(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/request-message.js [app-route] (ecmascript)"));
var bolt_protocol_util_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/bolt-protocol-util.js [app-route] (ecmascript)");
var stream_observers_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/stream-observers.js [app-route] (ecmascript)");
var bolt_protocol_v4x0_transformer_1 = __importDefault(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/bolt-protocol-v4x0.transformer.js [app-route] (ecmascript)"));
var transformer_1 = __importDefault(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/transformer.js [app-route] (ecmascript)"));
var neo4j_driver_core_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/index.js [app-route] (ecmascript)");
var Bookmarks = neo4j_driver_core_1.internal.bookmarks.Bookmarks, _a = neo4j_driver_core_1.internal.constants, BOLT_PROTOCOL_V4_0 = _a.BOLT_PROTOCOL_V4_0, FETCH_ALL = _a.FETCH_ALL, TxConfig = neo4j_driver_core_1.internal.txConfig.TxConfig;
var CONTEXT = 'context';
var DATABASE = 'database';
var CALL_GET_ROUTING_TABLE_MULTI_DB = "CALL dbms.routing.getRoutingTable($".concat(CONTEXT, ", $").concat(DATABASE, ")");
var BoltProtocol = function(_super) {
    __extends(BoltProtocol, _super);
    function BoltProtocol() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(BoltProtocol.prototype, "version", {
        get: function() {
            return BOLT_PROTOCOL_V4_0;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BoltProtocol.prototype, "transformer", {
        get: function() {
            var _this = this;
            if (this._transformer === undefined) {
                this._transformer = new transformer_1.default(Object.values(bolt_protocol_v4x0_transformer_1.default).map(function(create) {
                    return create(_this._config, _this._log);
                }));
            }
            return this._transformer;
        },
        enumerable: false,
        configurable: true
    });
    BoltProtocol.prototype.beginTransaction = function(_a) {
        var _b = _a === void 0 ? {} : _a, bookmarks = _b.bookmarks, txConfig = _b.txConfig, database = _b.database, impersonatedUser = _b.impersonatedUser, notificationFilter = _b.notificationFilter, mode = _b.mode, beforeError = _b.beforeError, afterError = _b.afterError, beforeComplete = _b.beforeComplete, afterComplete = _b.afterComplete;
        var observer = new stream_observers_1.ResultStreamObserver({
            server: this._server,
            beforeError: beforeError,
            afterError: afterError,
            beforeComplete: beforeComplete,
            afterComplete: afterComplete
        });
        observer.prepareToHandleSingleResponse();
        // passing impersonated user on this protocol version throws an error
        (0, bolt_protocol_util_1.assertImpersonatedUserIsEmpty)(impersonatedUser, this._onProtocolError, observer);
        // passing notification filter on this protocol version throws an error
        (0, bolt_protocol_util_1.assertNotificationFilterIsEmpty)(notificationFilter, this._onProtocolError, observer);
        this.write(request_message_1.default.begin({
            bookmarks: bookmarks,
            txConfig: txConfig,
            database: database,
            mode: mode
        }), observer, true);
        return observer;
    };
    BoltProtocol.prototype.run = function(query, parameters, _a) {
        var _b = _a === void 0 ? {} : _a, bookmarks = _b.bookmarks, txConfig = _b.txConfig, database = _b.database, impersonatedUser = _b.impersonatedUser, notificationFilter = _b.notificationFilter, mode = _b.mode, beforeKeys = _b.beforeKeys, afterKeys = _b.afterKeys, beforeError = _b.beforeError, afterError = _b.afterError, beforeComplete = _b.beforeComplete, afterComplete = _b.afterComplete, _c = _b.flush, flush = _c === void 0 ? true : _c, _d = _b.reactive, reactive = _d === void 0 ? false : _d, _e = _b.fetchSize, fetchSize = _e === void 0 ? FETCH_ALL : _e, _f = _b.highRecordWatermark, highRecordWatermark = _f === void 0 ? Number.MAX_VALUE : _f, _g = _b.lowRecordWatermark, lowRecordWatermark = _g === void 0 ? Number.MAX_VALUE : _g;
        var observer = new stream_observers_1.ResultStreamObserver({
            server: this._server,
            reactive: reactive,
            fetchSize: fetchSize,
            moreFunction: this._requestMore.bind(this),
            discardFunction: this._requestDiscard.bind(this),
            beforeKeys: beforeKeys,
            afterKeys: afterKeys,
            beforeError: beforeError,
            afterError: afterError,
            beforeComplete: beforeComplete,
            afterComplete: afterComplete,
            highRecordWatermark: highRecordWatermark,
            lowRecordWatermark: lowRecordWatermark
        });
        // passing impersonated user on this protocol version throws an error
        (0, bolt_protocol_util_1.assertImpersonatedUserIsEmpty)(impersonatedUser, this._onProtocolError, observer);
        // passing notification filter on this protocol version throws an error
        (0, bolt_protocol_util_1.assertNotificationFilterIsEmpty)(notificationFilter, this._onProtocolError, observer);
        var flushRun = reactive;
        this.write(request_message_1.default.runWithMetadata(query, parameters, {
            bookmarks: bookmarks,
            txConfig: txConfig,
            database: database,
            mode: mode
        }), observer, flushRun && flush);
        if (!reactive) {
            this.write(request_message_1.default.pull({
                n: fetchSize
            }), observer, flush);
        }
        return observer;
    };
    BoltProtocol.prototype._requestMore = function(stmtId, n, observer) {
        this.write(request_message_1.default.pull({
            stmtId: stmtId,
            n: n
        }), observer, true);
    };
    BoltProtocol.prototype._requestDiscard = function(stmtId, observer) {
        this.write(request_message_1.default.discard({
            stmtId: stmtId
        }), observer, true);
    };
    BoltProtocol.prototype._noOp = function() {};
    /**
     * Request routing information
     *
     * @param {Object} param -
     * @param {object} param.routingContext The routing context used to define the routing table.
     *  Multi-datacenter deployments is one of its use cases
     * @param {string} param.databaseName The database name
     * @param {Bookmarks} params.sessionContext.bookmarks The bookmarks used for requesting the routing table
     * @param {string} params.sessionContext.mode The session mode
     * @param {string} params.sessionContext.database The database name used on the session
     * @param {function()} params.sessionContext.afterComplete The session param used after the session closed
     * @param {function(err: Error)} param.onError
     * @param {function(RawRoutingTable)} param.onCompleted
     * @returns {RouteObserver} the route observer
     */ BoltProtocol.prototype.requestRoutingInformation = function(_a) {
        var _b;
        var _c = _a.routingContext, routingContext = _c === void 0 ? {} : _c, _d = _a.databaseName, databaseName = _d === void 0 ? null : _d, _e = _a.sessionContext, sessionContext = _e === void 0 ? {} : _e, onError = _a.onError, onCompleted = _a.onCompleted;
        var resultObserver = this.run(CALL_GET_ROUTING_TABLE_MULTI_DB, (_b = {}, _b[CONTEXT] = routingContext, _b[DATABASE] = databaseName, _b), __assign(__assign({}, sessionContext), {
            txConfig: TxConfig.empty()
        }));
        return new stream_observers_1.ProcedureRouteObserver({
            resultObserver: resultObserver,
            onProtocolError: this._onProtocolError,
            onError: onError,
            onCompleted: onCompleted
        });
    };
    return BoltProtocol;
}(bolt_protocol_v3_1.default);
exports.default = BoltProtocol;
}),
"[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/bolt-protocol-v4x1.transformer.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
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
var __importDefault = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : {
        "default": mod
    };
};
Object.defineProperty(exports, "__esModule", {
    value: true
});
var bolt_protocol_v4x0_transformer_1 = __importDefault(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/bolt-protocol-v4x0.transformer.js [app-route] (ecmascript)"));
exports.default = __assign({}, bolt_protocol_v4x0_transformer_1.default);
}),
"[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/bolt-protocol-v4x1.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
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
var __importDefault = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : {
        "default": mod
    };
};
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
 */ var bolt_protocol_v4x0_1 = __importDefault(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/bolt-protocol-v4x0.js [app-route] (ecmascript)"));
var request_message_1 = __importDefault(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/request-message.js [app-route] (ecmascript)"));
var stream_observers_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/stream-observers.js [app-route] (ecmascript)");
var neo4j_driver_core_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/index.js [app-route] (ecmascript)");
var bolt_protocol_util_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/bolt-protocol-util.js [app-route] (ecmascript)");
var bolt_protocol_v4x1_transformer_1 = __importDefault(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/bolt-protocol-v4x1.transformer.js [app-route] (ecmascript)"));
var transformer_1 = __importDefault(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/transformer.js [app-route] (ecmascript)"));
var BOLT_PROTOCOL_V4_1 = neo4j_driver_core_1.internal.constants.BOLT_PROTOCOL_V4_1;
var BoltProtocol = function(_super) {
    __extends(BoltProtocol, _super);
    /**
     * @constructor
     * @param {Object} server the server informatio.
     * @param {Chunker} chunker the chunker.
     * @param {Object} packstreamConfig Packstream configuration
     * @param {boolean} packstreamConfig.disableLosslessIntegers if this connection should convert all received integers to native JS numbers.
     * @param {boolean} packstreamConfig.useBigInt if this connection should convert all received integers to native BigInt numbers.
     * @param {CreateResponseHandler} createResponseHandler Function which creates the response handler
     * @param {Logger} log the logger
     * @param {Object} serversideRouting
     *
     */ function BoltProtocol(server, chunker, packstreamConfig, createResponseHandler, log, onProtocolError, serversideRouting) {
        if (createResponseHandler === void 0) {
            createResponseHandler = function() {
                return null;
            };
        }
        var _this = _super.call(this, server, chunker, packstreamConfig, createResponseHandler, log, onProtocolError) || this;
        _this._serversideRouting = serversideRouting;
        return _this;
    }
    Object.defineProperty(BoltProtocol.prototype, "version", {
        get: function() {
            return BOLT_PROTOCOL_V4_1;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BoltProtocol.prototype, "transformer", {
        get: function() {
            var _this = this;
            if (this._transformer === undefined) {
                this._transformer = new transformer_1.default(Object.values(bolt_protocol_v4x1_transformer_1.default).map(function(create) {
                    return create(_this._config, _this._log);
                }));
            }
            return this._transformer;
        },
        enumerable: false,
        configurable: true
    });
    BoltProtocol.prototype.initialize = function(_a) {
        var _this = this;
        var _b = _a === void 0 ? {} : _a, userAgent = _b.userAgent, boltAgent = _b.boltAgent, authToken = _b.authToken, notificationFilter = _b.notificationFilter, onError = _b.onError, onComplete = _b.onComplete;
        var observer = new stream_observers_1.LoginObserver({
            onError: function(error) {
                return _this._onLoginError(error, onError);
            },
            onCompleted: function(metadata) {
                return _this._onLoginCompleted(metadata, authToken, onComplete);
            }
        });
        // passing notification filter on this protocol version throws an error
        (0, bolt_protocol_util_1.assertNotificationFilterIsEmpty)(notificationFilter, this._onProtocolError, observer);
        this.write(request_message_1.default.hello(userAgent, authToken, this._serversideRouting), observer, true);
        return observer;
    };
    return BoltProtocol;
}(bolt_protocol_v4x0_1.default);
exports.default = BoltProtocol;
}),
"[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/bolt-protocol-v4x2.transformer.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
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
var __importDefault = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : {
        "default": mod
    };
};
Object.defineProperty(exports, "__esModule", {
    value: true
});
var bolt_protocol_v4x1_transformer_1 = __importDefault(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/bolt-protocol-v4x1.transformer.js [app-route] (ecmascript)"));
exports.default = __assign({}, bolt_protocol_v4x1_transformer_1.default);
}),
"[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/bolt-protocol-v4x2.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
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
var __importDefault = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : {
        "default": mod
    };
};
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
 */ var bolt_protocol_v4x1_1 = __importDefault(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/bolt-protocol-v4x1.js [app-route] (ecmascript)"));
var neo4j_driver_core_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/index.js [app-route] (ecmascript)");
var bolt_protocol_v4x2_transformer_1 = __importDefault(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/bolt-protocol-v4x2.transformer.js [app-route] (ecmascript)"));
var transformer_1 = __importDefault(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/transformer.js [app-route] (ecmascript)"));
var BOLT_PROTOCOL_V4_2 = neo4j_driver_core_1.internal.constants.BOLT_PROTOCOL_V4_2;
var BoltProtocol = function(_super) {
    __extends(BoltProtocol, _super);
    function BoltProtocol() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(BoltProtocol.prototype, "version", {
        get: function() {
            return BOLT_PROTOCOL_V4_2;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BoltProtocol.prototype, "transformer", {
        get: function() {
            var _this = this;
            if (this._transformer === undefined) {
                this._transformer = new transformer_1.default(Object.values(bolt_protocol_v4x2_transformer_1.default).map(function(create) {
                    return create(_this._config, _this._log);
                }));
            }
            return this._transformer;
        },
        enumerable: false,
        configurable: true
    });
    return BoltProtocol;
}(bolt_protocol_v4x1_1.default);
exports.default = BoltProtocol;
}),
"[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/bolt-protocol-v4x3.transformer.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
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
var __importDefault = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : {
        "default": mod
    };
};
Object.defineProperty(exports, "__esModule", {
    value: true
});
var bolt_protocol_v4x2_transformer_1 = __importDefault(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/bolt-protocol-v4x2.transformer.js [app-route] (ecmascript)"));
exports.default = __assign({}, bolt_protocol_v4x2_transformer_1.default);
}),
"[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/bolt-protocol-v4x4.transformer.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
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
var __importDefault = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : {
        "default": mod
    };
};
Object.defineProperty(exports, "__esModule", {
    value: true
});
var bolt_protocol_v4x3_transformer_1 = __importDefault(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/bolt-protocol-v4x3.transformer.js [app-route] (ecmascript)"));
exports.default = __assign({}, bolt_protocol_v4x3_transformer_1.default);
}),
"[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/bolt-protocol-v5x0.utc.transformer.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
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
 */ var __read = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__read || function(o, n) {
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
var __importDefault = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : {
        "default": mod
    };
};
Object.defineProperty(exports, "__esModule", {
    value: true
});
var packstream_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/packstream/index.js [app-route] (ecmascript)");
var neo4j_driver_core_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/index.js [app-route] (ecmascript)");
var bolt_protocol_v4x4_transformer_1 = __importDefault(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/bolt-protocol-v4x4.transformer.js [app-route] (ecmascript)"));
var temporal_factory_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/temporal-factory.js [app-route] (ecmascript)");
var functional_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/lang/functional.js [app-route] (ecmascript)");
var localDateTimeToEpochSecond = neo4j_driver_core_1.internal.temporalUtil.localDateTimeToEpochSecond;
var DATE_TIME_WITH_ZONE_OFFSET = 0x49;
var DATE_TIME_WITH_ZONE_OFFSET_STRUCT_SIZE = 3;
var DATE_TIME_WITH_ZONE_ID = 0x69;
var DATE_TIME_WITH_ZONE_ID_STRUCT_SIZE = 3;
function createDateTimeWithZoneIdTransformer(config, logger) {
    var disableLosslessIntegers = config.disableLosslessIntegers, useBigInt = config.useBigInt;
    var dateTimeWithZoneIdTransformer = bolt_protocol_v4x4_transformer_1.default.createDateTimeWithZoneIdTransformer(config);
    return dateTimeWithZoneIdTransformer.extendsWith({
        signature: DATE_TIME_WITH_ZONE_ID,
        fromStructure: function(struct) {
            packstream_1.structure.verifyStructSize('DateTimeWithZoneId', DATE_TIME_WITH_ZONE_ID_STRUCT_SIZE, struct.size);
            var _a = __read(struct.fields, 3), epochSecond = _a[0], nano = _a[1], timeZoneId = _a[2];
            var localDateTime = getTimeInZoneId(timeZoneId, epochSecond, nano);
            var result = new neo4j_driver_core_1.DateTime(localDateTime.year, localDateTime.month, localDateTime.day, localDateTime.hour, localDateTime.minute, localDateTime.second, (0, neo4j_driver_core_1.int)(nano), localDateTime.timeZoneOffsetSeconds, timeZoneId);
            return convertIntegerPropsIfNeeded(result, disableLosslessIntegers, useBigInt);
        },
        toStructure: function(value) {
            var epochSecond = localDateTimeToEpochSecond(value.year, value.month, value.day, value.hour, value.minute, value.second, value.nanosecond);
            var offset = value.timeZoneOffsetSeconds != null ? value.timeZoneOffsetSeconds : getOffsetFromZoneId(value.timeZoneId, epochSecond, value.nanosecond);
            if (value.timeZoneOffsetSeconds == null) {
                logger.warn('DateTime objects without "timeZoneOffsetSeconds" property ' + 'are prune to bugs related to ambiguous times. For instance, ' + '2022-10-30T2:30:00[Europe/Berlin] could be GMT+1 or GMT+2.');
            }
            var utc = epochSecond.subtract(offset);
            var nano = (0, neo4j_driver_core_1.int)(value.nanosecond);
            var timeZoneId = value.timeZoneId;
            return new packstream_1.structure.Structure(DATE_TIME_WITH_ZONE_ID, [
                utc,
                nano,
                timeZoneId
            ]);
        }
    });
}
/**
 * Returns the offset for a given timezone id
 *
 * Javascript doesn't have support for direct getting the timezone offset from a given
 * TimeZoneId and DateTime in the given TimeZoneId. For solving this issue,
 *
 * 1. The ZoneId is applied to the timestamp, so we could make the difference between the
 * given timestamp and the new calculated one. This is the offset for the timezone
 * in the utc is equal to epoch (some time in the future or past)
 * 2. The offset is subtracted from the timestamp, so we have an estimated utc timestamp.
 * 3. The ZoneId is applied to the new timestamp, se we could could make the difference
 * between the new timestamp and the calculated one. This is the offset for the given timezone.
 *
 * Example:
 *    Input: 2022-3-27 1:59:59 'Europe/Berlin'
 *    Apply 1, 2022-3-27 1:59:59 => 2022-3-27 3:59:59 'Europe/Berlin' +2:00
 *    Apply 2, 2022-3-27 1:59:59 - 2:00 => 2022-3-26 23:59:59
 *    Apply 3, 2022-3-26 23:59:59 => 2022-3-27 00:59:59 'Europe/Berlin' +1:00
 *  The offset is +1 hour.
 *
 * @param {string} timeZoneId The timezone id
 * @param {Integer} epochSecond The epoch second in the timezone id
 * @param {Integerable} nanosecond The nanoseconds in the timezone id
 * @returns The timezone offset
 */ function getOffsetFromZoneId(timeZoneId, epochSecond, nanosecond) {
    var dateTimeWithZoneAppliedTwice = getTimeInZoneId(timeZoneId, epochSecond, nanosecond);
    // The wallclock form the current date time
    var epochWithZoneAppliedTwice = localDateTimeToEpochSecond(dateTimeWithZoneAppliedTwice.year, dateTimeWithZoneAppliedTwice.month, dateTimeWithZoneAppliedTwice.day, dateTimeWithZoneAppliedTwice.hour, dateTimeWithZoneAppliedTwice.minute, dateTimeWithZoneAppliedTwice.second, nanosecond);
    var offsetOfZoneInTheFutureUtc = epochWithZoneAppliedTwice.subtract(epochSecond);
    var guessedUtc = epochSecond.subtract(offsetOfZoneInTheFutureUtc);
    var zonedDateTimeFromGuessedUtc = getTimeInZoneId(timeZoneId, guessedUtc, nanosecond);
    var zonedEpochFromGuessedUtc = localDateTimeToEpochSecond(zonedDateTimeFromGuessedUtc.year, zonedDateTimeFromGuessedUtc.month, zonedDateTimeFromGuessedUtc.day, zonedDateTimeFromGuessedUtc.hour, zonedDateTimeFromGuessedUtc.minute, zonedDateTimeFromGuessedUtc.second, nanosecond);
    var offset = zonedEpochFromGuessedUtc.subtract(guessedUtc);
    return offset;
}
var dateTimeFormatCache = new Map();
function getDateTimeFormatForZoneId(timeZoneId) {
    if (!dateTimeFormatCache.has(timeZoneId)) {
        var formatter = new Intl.DateTimeFormat('en-US', {
            timeZone: timeZoneId,
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: false,
            era: 'narrow'
        });
        dateTimeFormatCache.set(timeZoneId, formatter);
    }
    return dateTimeFormatCache.get(timeZoneId);
}
function getTimeInZoneId(timeZoneId, epochSecond, nano) {
    var formatter = getDateTimeFormatForZoneId(timeZoneId);
    var utc = (0, neo4j_driver_core_1.int)(epochSecond).multiply(1000).add((0, neo4j_driver_core_1.int)(nano).div(1000000)).toNumber();
    var formattedUtcParts = formatter.formatToParts(utc);
    var localDateTime = formattedUtcParts.reduce(function(obj, currentValue) {
        if (currentValue.type === 'era') {
            obj.adjustEra = currentValue.value.toUpperCase() === 'B' ? function(year) {
                return year.subtract(1).negate();
            } // 1BC equals to year 0 in astronomical year numbering
             : functional_1.identity;
        } else if (currentValue.type === 'hour') {
            obj.hour = (0, neo4j_driver_core_1.int)(currentValue.value).modulo(24);
        } else if (currentValue.type !== 'literal') {
            obj[currentValue.type] = (0, neo4j_driver_core_1.int)(currentValue.value);
        }
        return obj;
    }, {});
    localDateTime.year = localDateTime.adjustEra(localDateTime.year);
    var epochInTimeZone = localDateTimeToEpochSecond(localDateTime.year, localDateTime.month, localDateTime.day, localDateTime.hour, localDateTime.minute, localDateTime.second, localDateTime.nanosecond);
    localDateTime.timeZoneOffsetSeconds = epochInTimeZone.subtract(epochSecond);
    localDateTime.hour = localDateTime.hour.modulo(24);
    return localDateTime;
}
function createDateTimeWithOffsetTransformer(config) {
    var disableLosslessIntegers = config.disableLosslessIntegers, useBigInt = config.useBigInt;
    var dateTimeWithOffsetTransformer = bolt_protocol_v4x4_transformer_1.default.createDateTimeWithOffsetTransformer(config);
    return dateTimeWithOffsetTransformer.extendsWith({
        signature: DATE_TIME_WITH_ZONE_OFFSET,
        toStructure: function(value) {
            var epochSecond = localDateTimeToEpochSecond(value.year, value.month, value.day, value.hour, value.minute, value.second, value.nanosecond);
            var nano = (0, neo4j_driver_core_1.int)(value.nanosecond);
            var timeZoneOffsetSeconds = (0, neo4j_driver_core_1.int)(value.timeZoneOffsetSeconds);
            var utcSecond = epochSecond.subtract(timeZoneOffsetSeconds);
            return new packstream_1.structure.Structure(DATE_TIME_WITH_ZONE_OFFSET, [
                utcSecond,
                nano,
                timeZoneOffsetSeconds
            ]);
        },
        fromStructure: function(struct) {
            packstream_1.structure.verifyStructSize('DateTimeWithZoneOffset', DATE_TIME_WITH_ZONE_OFFSET_STRUCT_SIZE, struct.size);
            var _a = __read(struct.fields, 3), utcSecond = _a[0], nano = _a[1], timeZoneOffsetSeconds = _a[2];
            var epochSecond = (0, neo4j_driver_core_1.int)(utcSecond).add(timeZoneOffsetSeconds);
            var localDateTime = (0, temporal_factory_1.epochSecondAndNanoToLocalDateTime)(epochSecond, nano);
            var result = new neo4j_driver_core_1.DateTime(localDateTime.year, localDateTime.month, localDateTime.day, localDateTime.hour, localDateTime.minute, localDateTime.second, localDateTime.nanosecond, timeZoneOffsetSeconds, null);
            return convertIntegerPropsIfNeeded(result, disableLosslessIntegers, useBigInt);
        }
    });
}
function convertIntegerPropsIfNeeded(obj, disableLosslessIntegers, useBigInt) {
    if (!disableLosslessIntegers && !useBigInt) {
        return obj;
    }
    var convert = function(value) {
        return useBigInt ? value.toBigInt() : value.toNumberOrInfinity();
    };
    var clone = Object.create(Object.getPrototypeOf(obj));
    for(var prop in obj){
        if (Object.prototype.hasOwnProperty.call(obj, prop) === true) {
            var value = obj[prop];
            clone[prop] = (0, neo4j_driver_core_1.isInt)(value) ? convert(value) : value;
        }
    }
    Object.freeze(clone);
    return clone;
}
exports.default = {
    createDateTimeWithZoneIdTransformer: createDateTimeWithZoneIdTransformer,
    createDateTimeWithOffsetTransformer: createDateTimeWithOffsetTransformer
};
}),
"[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/bolt-protocol-v4x3.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
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
 */ var bolt_protocol_v4x2_1 = __importDefault(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/bolt-protocol-v4x2.js [app-route] (ecmascript)"));
var request_message_1 = __importDefault(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/request-message.js [app-route] (ecmascript)"));
var stream_observers_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/stream-observers.js [app-route] (ecmascript)");
var bolt_protocol_util_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/bolt-protocol-util.js [app-route] (ecmascript)");
var bolt_protocol_v4x3_transformer_1 = __importDefault(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/bolt-protocol-v4x3.transformer.js [app-route] (ecmascript)"));
var bolt_protocol_v5x0_utc_transformer_1 = __importDefault(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/bolt-protocol-v5x0.utc.transformer.js [app-route] (ecmascript)"));
var transformer_1 = __importDefault(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/transformer.js [app-route] (ecmascript)"));
var neo4j_driver_core_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/index.js [app-route] (ecmascript)");
var Bookmarks = neo4j_driver_core_1.internal.bookmarks.Bookmarks, BOLT_PROTOCOL_V4_3 = neo4j_driver_core_1.internal.constants.BOLT_PROTOCOL_V4_3;
var BoltProtocol = function(_super) {
    __extends(BoltProtocol, _super);
    function BoltProtocol() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(BoltProtocol.prototype, "version", {
        get: function() {
            return BOLT_PROTOCOL_V4_3;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BoltProtocol.prototype, "transformer", {
        get: function() {
            var _this = this;
            if (this._transformer === undefined) {
                this._transformer = new transformer_1.default(Object.values(bolt_protocol_v4x3_transformer_1.default).map(function(create) {
                    return create(_this._config, _this._log);
                }));
            }
            return this._transformer;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Request routing information
     *
     * @param {Object} param -
     * @param {object} param.routingContext The routing context used to define the routing table.
     *  Multi-datacenter deployments is one of its use cases
     * @param {string} param.databaseName The database name
     * @param {Bookmarks} params.sessionContext.bookmarks The bookmarks used for requesting the routing table
     * @param {function(err: Error)} param.onError
     * @param {function(RawRoutingTable)} param.onCompleted
     * @returns {RouteObserver} the route observer
     */ BoltProtocol.prototype.requestRoutingInformation = function(_a) {
        var _b = _a.routingContext, routingContext = _b === void 0 ? {} : _b, _c = _a.databaseName, databaseName = _c === void 0 ? null : _c, _d = _a.sessionContext, sessionContext = _d === void 0 ? {} : _d, onError = _a.onError, onCompleted = _a.onCompleted;
        var observer = new stream_observers_1.RouteObserver({
            onProtocolError: this._onProtocolError,
            onError: onError,
            onCompleted: onCompleted
        });
        var bookmarks = sessionContext.bookmarks || Bookmarks.empty();
        this.write(request_message_1.default.route(routingContext, bookmarks.values(), databaseName), observer, true);
        return observer;
    };
    /**
     * Initialize a connection with the server
     *
     * @param {Object} args The params
     * @param {string} args.userAgent The user agent
     * @param {any} args.authToken The auth token
     * @param {NotificationFilter} args.notificationFilter The notification filter.
     * @param {function(error)} args.onError On error callback
     * @param {function(onComplte)} args.onComplete On complete callback
     * @returns {LoginObserver} The Login observer
     */ BoltProtocol.prototype.initialize = function(_a) {
        var _this = this;
        var _b = _a === void 0 ? {} : _a, userAgent = _b.userAgent, boltAgent = _b.boltAgent, authToken = _b.authToken, notificationFilter = _b.notificationFilter, onError = _b.onError, onComplete = _b.onComplete;
        var observer = new stream_observers_1.LoginObserver({
            onError: function(error) {
                return _this._onLoginError(error, onError);
            },
            onCompleted: function(metadata) {
                if (metadata.patch_bolt !== undefined) {
                    _this._applyPatches(metadata.patch_bolt);
                }
                return _this._onLoginCompleted(metadata, authToken, onComplete);
            }
        });
        // passing notification filter on this protocol version throws an error
        (0, bolt_protocol_util_1.assertNotificationFilterIsEmpty)(notificationFilter, this._onProtocolError, observer);
        this.write(request_message_1.default.hello(userAgent, authToken, this._serversideRouting, [
            'utc'
        ]), observer, true);
        return observer;
    };
    /**
     *
     * @param {string[]} patches Patches to be applied to the protocol
     */ BoltProtocol.prototype._applyPatches = function(patches) {
        if (patches.includes('utc')) {
            this._applyUtcPatch();
        }
    };
    BoltProtocol.prototype._applyUtcPatch = function() {
        var _this = this;
        this._transformer = new transformer_1.default(Object.values(__assign(__assign({}, bolt_protocol_v4x3_transformer_1.default), bolt_protocol_v5x0_utc_transformer_1.default)).map(function(create) {
            return create(_this._config, _this._log);
        }));
    };
    return BoltProtocol;
}(bolt_protocol_v4x2_1.default);
exports.default = BoltProtocol;
}),
"[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/bolt-protocol-v4x4.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
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
 */ var bolt_protocol_v4x3_1 = __importDefault(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/bolt-protocol-v4x3.js [app-route] (ecmascript)"));
var neo4j_driver_core_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/index.js [app-route] (ecmascript)");
var request_message_1 = __importDefault(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/request-message.js [app-route] (ecmascript)"));
var stream_observers_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/stream-observers.js [app-route] (ecmascript)");
var bolt_protocol_util_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/bolt-protocol-util.js [app-route] (ecmascript)");
var bolt_protocol_v4x4_transformer_1 = __importDefault(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/bolt-protocol-v4x4.transformer.js [app-route] (ecmascript)"));
var bolt_protocol_v5x0_utc_transformer_1 = __importDefault(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/bolt-protocol-v5x0.utc.transformer.js [app-route] (ecmascript)"));
var transformer_1 = __importDefault(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/transformer.js [app-route] (ecmascript)"));
var _a = neo4j_driver_core_1.internal.constants, BOLT_PROTOCOL_V4_4 = _a.BOLT_PROTOCOL_V4_4, FETCH_ALL = _a.FETCH_ALL, Bookmarks = neo4j_driver_core_1.internal.bookmarks.Bookmarks;
var BoltProtocol = function(_super) {
    __extends(BoltProtocol, _super);
    function BoltProtocol() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(BoltProtocol.prototype, "version", {
        get: function() {
            return BOLT_PROTOCOL_V4_4;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BoltProtocol.prototype, "transformer", {
        get: function() {
            var _this = this;
            if (this._transformer === undefined) {
                this._transformer = new transformer_1.default(Object.values(bolt_protocol_v4x4_transformer_1.default).map(function(create) {
                    return create(_this._config, _this._log);
                }));
            }
            return this._transformer;
        },
        enumerable: false,
        configurable: true
    });
    /**
    * Request routing information
    *
    * @param {Object} param -
    * @param {object} param.routingContext The routing context used to define the routing table.
    *  Multi-datacenter deployments is one of its use cases
    * @param {string} param.databaseName The database name
    * @param {Bookmarks} params.sessionContext.bookmarks The bookmarks used for requesting the routing table
    * @param {function(err: Error)} param.onError
    * @param {function(RawRoutingTable)} param.onCompleted
    * @returns {RouteObserver} the route observer
    */ BoltProtocol.prototype.requestRoutingInformation = function(_a) {
        var _b = _a.routingContext, routingContext = _b === void 0 ? {} : _b, _c = _a.databaseName, databaseName = _c === void 0 ? null : _c, _d = _a.impersonatedUser, impersonatedUser = _d === void 0 ? null : _d, _e = _a.sessionContext, sessionContext = _e === void 0 ? {} : _e, onError = _a.onError, onCompleted = _a.onCompleted;
        var observer = new stream_observers_1.RouteObserver({
            onProtocolError: this._onProtocolError,
            onError: onError,
            onCompleted: onCompleted
        });
        var bookmarks = sessionContext.bookmarks || Bookmarks.empty();
        this.write(request_message_1.default.routeV4x4(routingContext, bookmarks.values(), {
            databaseName: databaseName,
            impersonatedUser: impersonatedUser
        }), observer, true);
        return observer;
    };
    BoltProtocol.prototype.run = function(query, parameters, _a) {
        var _b = _a === void 0 ? {} : _a, bookmarks = _b.bookmarks, txConfig = _b.txConfig, database = _b.database, mode = _b.mode, impersonatedUser = _b.impersonatedUser, notificationFilter = _b.notificationFilter, beforeKeys = _b.beforeKeys, afterKeys = _b.afterKeys, beforeError = _b.beforeError, afterError = _b.afterError, beforeComplete = _b.beforeComplete, afterComplete = _b.afterComplete, _c = _b.flush, flush = _c === void 0 ? true : _c, _d = _b.reactive, reactive = _d === void 0 ? false : _d, _e = _b.fetchSize, fetchSize = _e === void 0 ? FETCH_ALL : _e, _f = _b.highRecordWatermark, highRecordWatermark = _f === void 0 ? Number.MAX_VALUE : _f, _g = _b.lowRecordWatermark, lowRecordWatermark = _g === void 0 ? Number.MAX_VALUE : _g;
        var observer = new stream_observers_1.ResultStreamObserver({
            server: this._server,
            reactive: reactive,
            fetchSize: fetchSize,
            moreFunction: this._requestMore.bind(this),
            discardFunction: this._requestDiscard.bind(this),
            beforeKeys: beforeKeys,
            afterKeys: afterKeys,
            beforeError: beforeError,
            afterError: afterError,
            beforeComplete: beforeComplete,
            afterComplete: afterComplete,
            highRecordWatermark: highRecordWatermark,
            lowRecordWatermark: lowRecordWatermark
        });
        // passing notification filter on this protocol version throws an error
        (0, bolt_protocol_util_1.assertNotificationFilterIsEmpty)(notificationFilter, this._onProtocolError, observer);
        var flushRun = reactive;
        this.write(request_message_1.default.runWithMetadata(query, parameters, {
            bookmarks: bookmarks,
            txConfig: txConfig,
            database: database,
            mode: mode,
            impersonatedUser: impersonatedUser
        }), observer, flushRun && flush);
        if (!reactive) {
            this.write(request_message_1.default.pull({
                n: fetchSize
            }), observer, flush);
        }
        return observer;
    };
    BoltProtocol.prototype.beginTransaction = function(_a) {
        var _b = _a === void 0 ? {} : _a, bookmarks = _b.bookmarks, txConfig = _b.txConfig, database = _b.database, mode = _b.mode, impersonatedUser = _b.impersonatedUser, notificationFilter = _b.notificationFilter, beforeError = _b.beforeError, afterError = _b.afterError, beforeComplete = _b.beforeComplete, afterComplete = _b.afterComplete;
        var observer = new stream_observers_1.ResultStreamObserver({
            server: this._server,
            beforeError: beforeError,
            afterError: afterError,
            beforeComplete: beforeComplete,
            afterComplete: afterComplete
        });
        observer.prepareToHandleSingleResponse();
        // passing notification filter on this protocol version throws an error
        (0, bolt_protocol_util_1.assertNotificationFilterIsEmpty)(notificationFilter, this._onProtocolError, observer);
        this.write(request_message_1.default.begin({
            bookmarks: bookmarks,
            txConfig: txConfig,
            database: database,
            mode: mode,
            impersonatedUser: impersonatedUser
        }), observer, true);
        return observer;
    };
    BoltProtocol.prototype._applyUtcPatch = function() {
        var _this = this;
        this._transformer = new transformer_1.default(Object.values(__assign(__assign({}, bolt_protocol_v4x4_transformer_1.default), bolt_protocol_v5x0_utc_transformer_1.default)).map(function(create) {
            return create(_this._config, _this._log);
        }));
    };
    return BoltProtocol;
}(bolt_protocol_v4x3_1.default);
exports.default = BoltProtocol;
}),
"[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/bolt-protocol-v5x0.transformer.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
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
var __importDefault = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : {
        "default": mod
    };
};
Object.defineProperty(exports, "__esModule", {
    value: true
});
var packstream_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/packstream/index.js [app-route] (ecmascript)");
var neo4j_driver_core_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/index.js [app-route] (ecmascript)");
var bolt_protocol_v4x4_transformer_1 = __importDefault(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/bolt-protocol-v4x4.transformer.js [app-route] (ecmascript)"));
var bolt_protocol_v5x0_utc_transformer_1 = __importDefault(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/bolt-protocol-v5x0.utc.transformer.js [app-route] (ecmascript)"));
var NODE_STRUCT_SIZE = 4;
var RELATIONSHIP_STRUCT_SIZE = 8;
var UNBOUND_RELATIONSHIP_STRUCT_SIZE = 4;
/**
 * Create an extend Node transformer with support to elementId
 * @param {any} config
 * @returns {TypeTransformer}
 */ function createNodeTransformer(config) {
    var node4x4Transformer = bolt_protocol_v4x4_transformer_1.default.createNodeTransformer(config);
    return node4x4Transformer.extendsWith({
        fromStructure: function(struct) {
            packstream_1.structure.verifyStructSize('Node', NODE_STRUCT_SIZE, struct.size);
            var _a = __read(struct.fields, 4), identity = _a[0], lables = _a[1], properties = _a[2], elementId = _a[3];
            return new neo4j_driver_core_1.Node(identity, lables, properties, elementId);
        }
    });
}
/**
 * Create an extend Relationship transformer with support to elementId
 * @param {any} config
 * @returns {TypeTransformer}
 */ function createRelationshipTransformer(config) {
    var relationship4x4Transformer = bolt_protocol_v4x4_transformer_1.default.createRelationshipTransformer(config);
    return relationship4x4Transformer.extendsWith({
        fromStructure: function(struct) {
            packstream_1.structure.verifyStructSize('Relationship', RELATIONSHIP_STRUCT_SIZE, struct.size);
            var _a = __read(struct.fields, 8), identity = _a[0], startNodeIdentity = _a[1], endNodeIdentity = _a[2], type = _a[3], properties = _a[4], elementId = _a[5], startNodeElementId = _a[6], endNodeElementId = _a[7];
            return new neo4j_driver_core_1.Relationship(identity, startNodeIdentity, endNodeIdentity, type, properties, elementId, startNodeElementId, endNodeElementId);
        }
    });
}
/**
 * Create an extend Unbound Relationship transformer with support to elementId
 * @param {any} config
 * @returns {TypeTransformer}
 */ function createUnboundRelationshipTransformer(config) {
    var unboundRelationshipTransformer = bolt_protocol_v4x4_transformer_1.default.createUnboundRelationshipTransformer(config);
    return unboundRelationshipTransformer.extendsWith({
        fromStructure: function(struct) {
            packstream_1.structure.verifyStructSize('UnboundRelationship', UNBOUND_RELATIONSHIP_STRUCT_SIZE, struct.size);
            var _a = __read(struct.fields, 4), identity = _a[0], type = _a[1], properties = _a[2], elementId = _a[3];
            return new neo4j_driver_core_1.UnboundRelationship(identity, type, properties, elementId);
        }
    });
}
exports.default = __assign(__assign(__assign({}, bolt_protocol_v4x4_transformer_1.default), bolt_protocol_v5x0_utc_transformer_1.default), {
    createNodeTransformer: createNodeTransformer,
    createRelationshipTransformer: createRelationshipTransformer,
    createUnboundRelationshipTransformer: createUnboundRelationshipTransformer
});
}),
"[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/bolt-protocol-v5x0.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
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
var __importDefault = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : {
        "default": mod
    };
};
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
 */ var bolt_protocol_v4x4_1 = __importDefault(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/bolt-protocol-v4x4.js [app-route] (ecmascript)"));
var bolt_protocol_util_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/bolt-protocol-util.js [app-route] (ecmascript)");
var bolt_protocol_v5x0_transformer_1 = __importDefault(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/bolt-protocol-v5x0.transformer.js [app-route] (ecmascript)"));
var transformer_1 = __importDefault(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/transformer.js [app-route] (ecmascript)"));
var request_message_1 = __importDefault(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/request-message.js [app-route] (ecmascript)"));
var stream_observers_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/stream-observers.js [app-route] (ecmascript)");
var neo4j_driver_core_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/index.js [app-route] (ecmascript)");
var BOLT_PROTOCOL_V5_0 = neo4j_driver_core_1.internal.constants.BOLT_PROTOCOL_V5_0;
var BoltProtocol = function(_super) {
    __extends(BoltProtocol, _super);
    function BoltProtocol() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(BoltProtocol.prototype, "version", {
        get: function() {
            return BOLT_PROTOCOL_V5_0;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BoltProtocol.prototype, "transformer", {
        get: function() {
            var _this = this;
            if (this._transformer === undefined) {
                this._transformer = new transformer_1.default(Object.values(bolt_protocol_v5x0_transformer_1.default).map(function(create) {
                    return create(_this._config, _this._log);
                }));
            }
            return this._transformer;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Initialize a connection with the server
     *
     * @param {Object} args The params
     * @param {string} args.userAgent The user agent
     * @param {any} args.authToken The auth token
     * @param {NotificationFilter} args.notificationFilter The notification filter.
     * @param {function(error)} args.onError On error callback
     * @param {function(onComplte)} args.onComplete On complete callback
     * @returns {LoginObserver} The Login observer
     */ BoltProtocol.prototype.initialize = function(_a) {
        var _this = this;
        var _b = _a === void 0 ? {} : _a, userAgent = _b.userAgent, boltAgent = _b.boltAgent, authToken = _b.authToken, notificationFilter = _b.notificationFilter, onError = _b.onError, onComplete = _b.onComplete;
        var observer = new stream_observers_1.LoginObserver({
            onError: function(error) {
                return _this._onLoginError(error, onError);
            },
            onCompleted: function(metadata) {
                return _this._onLoginCompleted(metadata, authToken, onComplete);
            }
        });
        // passing notification filter on this protocol version throws an error
        (0, bolt_protocol_util_1.assertNotificationFilterIsEmpty)(notificationFilter, this._onProtocolError, observer);
        this.write(request_message_1.default.hello(userAgent, authToken, this._serversideRouting), observer, true);
        return observer;
    };
    return BoltProtocol;
}(bolt_protocol_v4x4_1.default);
exports.default = BoltProtocol;
}),
"[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/bolt-protocol-v5x1.transformer.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
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
var __importDefault = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : {
        "default": mod
    };
};
Object.defineProperty(exports, "__esModule", {
    value: true
});
var bolt_protocol_v5x0_transformer_1 = __importDefault(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/bolt-protocol-v5x0.transformer.js [app-route] (ecmascript)"));
exports.default = __assign({}, bolt_protocol_v5x0_transformer_1.default);
}),
"[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/bolt-protocol-v5x1.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
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
 */ var bolt_protocol_v5x0_1 = __importDefault(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/bolt-protocol-v5x0.js [app-route] (ecmascript)"));
var bolt_protocol_util_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/bolt-protocol-util.js [app-route] (ecmascript)");
var bolt_protocol_v5x1_transformer_1 = __importDefault(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/bolt-protocol-v5x1.transformer.js [app-route] (ecmascript)"));
var transformer_1 = __importDefault(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/transformer.js [app-route] (ecmascript)"));
var request_message_1 = __importDefault(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/request-message.js [app-route] (ecmascript)"));
var stream_observers_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/stream-observers.js [app-route] (ecmascript)");
var neo4j_driver_core_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/index.js [app-route] (ecmascript)");
var BOLT_PROTOCOL_V5_1 = neo4j_driver_core_1.internal.constants.BOLT_PROTOCOL_V5_1;
var BoltProtocol = function(_super) {
    __extends(BoltProtocol, _super);
    function BoltProtocol() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(BoltProtocol.prototype, "version", {
        get: function() {
            return BOLT_PROTOCOL_V5_1;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BoltProtocol.prototype, "transformer", {
        get: function() {
            var _this = this;
            if (this._transformer === undefined) {
                this._transformer = new transformer_1.default(Object.values(bolt_protocol_v5x1_transformer_1.default).map(function(create) {
                    return create(_this._config, _this._log);
                }));
            }
            return this._transformer;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BoltProtocol.prototype, "supportsReAuth", {
        get: function() {
            return true;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Initialize a connection with the server
     *
     * @param {Object} args The params
     * @param {string} args.userAgent The user agent
     * @param {any} args.authToken The auth token
     * @param {NotificationFilter} args.notificationFilter The notification filters.
     * @param {function(error)} args.onError On error callback
     * @param {function(onComplete)} args.onComplete On complete callback
     * @returns {LoginObserver} The Login observer
     */ BoltProtocol.prototype.initialize = function(_a) {
        var _this = this;
        var _b = _a === void 0 ? {} : _a, userAgent = _b.userAgent, boltAgent = _b.boltAgent, authToken = _b.authToken, notificationFilter = _b.notificationFilter, onError = _b.onError, onComplete = _b.onComplete;
        var state = {};
        var observer = new stream_observers_1.LoginObserver({
            onError: function(error) {
                return _this._onLoginError(error, onError);
            },
            onCompleted: function(metadata) {
                state.metadata = metadata;
                return _this._onLoginCompleted(metadata);
            }
        });
        // passing notification filter on this protocol version throws an error
        (0, bolt_protocol_util_1.assertNotificationFilterIsEmpty)(notificationFilter, this._onProtocolError, observer);
        this.write(request_message_1.default.hello5x1(userAgent, this._serversideRouting), observer, false);
        return this.logon({
            authToken: authToken,
            onComplete: function(metadata) {
                return onComplete(__assign(__assign({}, metadata), state.metadata));
            },
            onError: onError,
            flush: true
        });
    };
    /**
     * Performs login of the underlying connection
     *
     * @param {Object} args
     * @param {Object} args.authToken the authentication token.
     * @param {function(err: Error)} args.onError the callback to invoke on error.
     * @param {function()} args.onComplete the callback to invoke on completion.
     * @param {boolean} args.flush whether to flush the buffered messages.
     *
     * @returns {StreamObserver} the stream observer that monitors the corresponding server response.
     */ BoltProtocol.prototype.logon = function(_a) {
        var _this = this;
        var _b = _a === void 0 ? {} : _a, authToken = _b.authToken, onComplete = _b.onComplete, onError = _b.onError, flush = _b.flush;
        var observer = new stream_observers_1.LoginObserver({
            onCompleted: function() {
                return _this._onLoginCompleted(null, authToken, onComplete);
            },
            onError: function(error) {
                return _this._onLoginError(error, onError);
            }
        });
        this.write(request_message_1.default.logon(authToken), observer, flush);
        return observer;
    };
    /**
     * Performs logoff of the underlying connection
     *
     * @param {Object} param
     * @param {function(err: Error)} param.onError the callback to invoke on error.
     * @param {function()} param.onComplete the callback to invoke on completion.
     * @param {boolean} param.flush whether to flush the buffered messages.
     *
     * @returns {StreamObserver} the stream observer that monitors the corresponding server response.
    */ BoltProtocol.prototype.logoff = function(_a) {
        var _b = _a === void 0 ? {} : _a, onComplete = _b.onComplete, onError = _b.onError, flush = _b.flush;
        var observer = new stream_observers_1.LogoffObserver({
            onCompleted: onComplete,
            onError: onError
        });
        this.write(request_message_1.default.logoff(), observer, flush);
        return observer;
    };
    return BoltProtocol;
}(bolt_protocol_v5x0_1.default);
exports.default = BoltProtocol;
}),
"[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/bolt-protocol-v5x2.transformer.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
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
var __importDefault = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : {
        "default": mod
    };
};
Object.defineProperty(exports, "__esModule", {
    value: true
});
var bolt_protocol_v5x1_transformer_1 = __importDefault(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/bolt-protocol-v5x1.transformer.js [app-route] (ecmascript)"));
exports.default = __assign({}, bolt_protocol_v5x1_transformer_1.default);
}),
"[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/bolt-protocol-v5x2.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
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
 */ var bolt_protocol_v5x1_1 = __importDefault(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/bolt-protocol-v5x1.js [app-route] (ecmascript)"));
var bolt_protocol_v5x2_transformer_1 = __importDefault(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/bolt-protocol-v5x2.transformer.js [app-route] (ecmascript)"));
var transformer_1 = __importDefault(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/transformer.js [app-route] (ecmascript)"));
var request_message_1 = __importDefault(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/request-message.js [app-route] (ecmascript)"));
var stream_observers_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/stream-observers.js [app-route] (ecmascript)");
var neo4j_driver_core_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/index.js [app-route] (ecmascript)");
var _a = neo4j_driver_core_1.internal.constants, BOLT_PROTOCOL_V5_2 = _a.BOLT_PROTOCOL_V5_2, FETCH_ALL = _a.FETCH_ALL;
var BoltProtocol = function(_super) {
    __extends(BoltProtocol, _super);
    function BoltProtocol() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(BoltProtocol.prototype, "version", {
        get: function() {
            return BOLT_PROTOCOL_V5_2;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BoltProtocol.prototype, "transformer", {
        get: function() {
            var _this = this;
            if (this._transformer === undefined) {
                this._transformer = new transformer_1.default(Object.values(bolt_protocol_v5x2_transformer_1.default).map(function(create) {
                    return create(_this._config, _this._log);
                }));
            }
            return this._transformer;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BoltProtocol.prototype, "supportsReAuth", {
        get: function() {
            return true;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Initialize a connection with the server
     *
     * @param {Object} args The params
     * @param {string} args.userAgent The user agent
     * @param {string} args.boltAgent The bolt agent
     * @param {any} args.authToken The auth token
     * @param {NotificationFilter} args.notificationFilter The notification filters.
     * @param {function(error)} args.onError On error callback
     * @param {function(onComplete)} args.onComplete On complete callback
     * @returns {LoginObserver} The Login observer
     */ BoltProtocol.prototype.initialize = function(_a) {
        var _this = this;
        var _b = _a === void 0 ? {} : _a, userAgent = _b.userAgent, boltAgent = _b.boltAgent, authToken = _b.authToken, notificationFilter = _b.notificationFilter, onError = _b.onError, onComplete = _b.onComplete;
        var state = {};
        var observer = new stream_observers_1.LoginObserver({
            onError: function(error) {
                return _this._onLoginError(error, onError);
            },
            onCompleted: function(metadata) {
                state.metadata = metadata;
                return _this._onLoginCompleted(metadata);
            }
        });
        this.write(// if useragent is null then for all versions before 5.3 it should be bolt agent by default
        request_message_1.default.hello5x2(userAgent, notificationFilter, this._serversideRouting), observer, false);
        return this.logon({
            authToken: authToken,
            onComplete: function(metadata) {
                return onComplete(__assign(__assign({}, metadata), state.metadata));
            },
            onError: onError,
            flush: true
        });
    };
    BoltProtocol.prototype.beginTransaction = function(_a) {
        var _b = _a === void 0 ? {} : _a, bookmarks = _b.bookmarks, txConfig = _b.txConfig, database = _b.database, mode = _b.mode, impersonatedUser = _b.impersonatedUser, notificationFilter = _b.notificationFilter, beforeError = _b.beforeError, afterError = _b.afterError, beforeComplete = _b.beforeComplete, afterComplete = _b.afterComplete;
        var observer = new stream_observers_1.ResultStreamObserver({
            server: this._server,
            beforeError: beforeError,
            afterError: afterError,
            beforeComplete: beforeComplete,
            afterComplete: afterComplete
        });
        observer.prepareToHandleSingleResponse();
        this.write(request_message_1.default.begin({
            bookmarks: bookmarks,
            txConfig: txConfig,
            database: database,
            mode: mode,
            impersonatedUser: impersonatedUser,
            notificationFilter: notificationFilter
        }), observer, true);
        return observer;
    };
    BoltProtocol.prototype.run = function(query, parameters, _a) {
        var _b = _a === void 0 ? {} : _a, bookmarks = _b.bookmarks, txConfig = _b.txConfig, database = _b.database, mode = _b.mode, impersonatedUser = _b.impersonatedUser, notificationFilter = _b.notificationFilter, beforeKeys = _b.beforeKeys, afterKeys = _b.afterKeys, beforeError = _b.beforeError, afterError = _b.afterError, beforeComplete = _b.beforeComplete, afterComplete = _b.afterComplete, _c = _b.flush, flush = _c === void 0 ? true : _c, _d = _b.reactive, reactive = _d === void 0 ? false : _d, _e = _b.fetchSize, fetchSize = _e === void 0 ? FETCH_ALL : _e, _f = _b.highRecordWatermark, highRecordWatermark = _f === void 0 ? Number.MAX_VALUE : _f, _g = _b.lowRecordWatermark, lowRecordWatermark = _g === void 0 ? Number.MAX_VALUE : _g;
        var observer = new stream_observers_1.ResultStreamObserver({
            server: this._server,
            reactive: reactive,
            fetchSize: fetchSize,
            moreFunction: this._requestMore.bind(this),
            discardFunction: this._requestDiscard.bind(this),
            beforeKeys: beforeKeys,
            afterKeys: afterKeys,
            beforeError: beforeError,
            afterError: afterError,
            beforeComplete: beforeComplete,
            afterComplete: afterComplete,
            highRecordWatermark: highRecordWatermark,
            lowRecordWatermark: lowRecordWatermark
        });
        var flushRun = reactive;
        this.write(request_message_1.default.runWithMetadata(query, parameters, {
            bookmarks: bookmarks,
            txConfig: txConfig,
            database: database,
            mode: mode,
            impersonatedUser: impersonatedUser,
            notificationFilter: notificationFilter
        }), observer, flushRun && flush);
        if (!reactive) {
            this.write(request_message_1.default.pull({
                n: fetchSize
            }), observer, flush);
        }
        return observer;
    };
    return BoltProtocol;
}(bolt_protocol_v5x1_1.default);
exports.default = BoltProtocol;
}),
"[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/bolt-protocol-v5x3.transformer.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
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
var __importDefault = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : {
        "default": mod
    };
};
Object.defineProperty(exports, "__esModule", {
    value: true
});
var bolt_protocol_v5x2_transformer_1 = __importDefault(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/bolt-protocol-v5x2.transformer.js [app-route] (ecmascript)"));
exports.default = __assign({}, bolt_protocol_v5x2_transformer_1.default);
}),
"[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/bolt-protocol-v5x3.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
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
 */ var bolt_protocol_v5x2_1 = __importDefault(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/bolt-protocol-v5x2.js [app-route] (ecmascript)"));
var bolt_protocol_v5x3_transformer_1 = __importDefault(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/bolt-protocol-v5x3.transformer.js [app-route] (ecmascript)"));
var transformer_1 = __importDefault(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/transformer.js [app-route] (ecmascript)"));
var request_message_1 = __importDefault(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/request-message.js [app-route] (ecmascript)"));
var stream_observers_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/stream-observers.js [app-route] (ecmascript)");
var neo4j_driver_core_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/index.js [app-route] (ecmascript)");
var BOLT_PROTOCOL_V5_3 = neo4j_driver_core_1.internal.constants.BOLT_PROTOCOL_V5_3;
var BoltProtocol = function(_super) {
    __extends(BoltProtocol, _super);
    function BoltProtocol() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(BoltProtocol.prototype, "version", {
        get: function() {
            return BOLT_PROTOCOL_V5_3;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BoltProtocol.prototype, "transformer", {
        get: function() {
            var _this = this;
            if (this._transformer === undefined) {
                this._transformer = new transformer_1.default(Object.values(bolt_protocol_v5x3_transformer_1.default).map(function(create) {
                    return create(_this._config, _this._log);
                }));
            }
            return this._transformer;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Initialize a connection with the server
     *
     * @param {Object} args The params
     * @param {string} args.userAgent The user agent
     * @param {any} args.authToken The auth token
     * @param {NotificationFilter} args.notificationFilter The notification filters.
     * @param {function(error)} args.onError On error callback
     * @param {function(onComplete)} args.onComplete On complete callback
     * @returns {LoginObserver} The Login observer
     */ BoltProtocol.prototype.initialize = function(_a) {
        var _this = this;
        var _b = _a === void 0 ? {} : _a, userAgent = _b.userAgent, boltAgent = _b.boltAgent, authToken = _b.authToken, notificationFilter = _b.notificationFilter, onError = _b.onError, onComplete = _b.onComplete;
        var state = {};
        var observer = new stream_observers_1.LoginObserver({
            onError: function(error) {
                return _this._onLoginError(error, onError);
            },
            onCompleted: function(metadata) {
                state.metadata = metadata;
                return _this._onLoginCompleted(metadata);
            }
        });
        this.write(request_message_1.default.hello5x3(userAgent, boltAgent, notificationFilter, this._serversideRouting), observer, false);
        return this.logon({
            authToken: authToken,
            onComplete: function(metadata) {
                return onComplete(__assign(__assign({}, metadata), state.metadata));
            },
            onError: onError,
            flush: true
        });
    };
    return BoltProtocol;
}(bolt_protocol_v5x2_1.default);
exports.default = BoltProtocol;
}),
"[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/bolt-protocol-v5x4.transformer.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
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
var __importDefault = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : {
        "default": mod
    };
};
Object.defineProperty(exports, "__esModule", {
    value: true
});
var bolt_protocol_v5x3_transformer_1 = __importDefault(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/bolt-protocol-v5x3.transformer.js [app-route] (ecmascript)"));
exports.default = __assign({}, bolt_protocol_v5x3_transformer_1.default);
}),
"[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/bolt-protocol-v5x4.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
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
var __importDefault = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : {
        "default": mod
    };
};
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
 */ var bolt_protocol_v5x3_1 = __importDefault(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/bolt-protocol-v5x3.js [app-route] (ecmascript)"));
var bolt_protocol_v5x4_transformer_1 = __importDefault(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/bolt-protocol-v5x4.transformer.js [app-route] (ecmascript)"));
var request_message_1 = __importDefault(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/request-message.js [app-route] (ecmascript)"));
var stream_observers_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/stream-observers.js [app-route] (ecmascript)");
var transformer_1 = __importDefault(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/transformer.js [app-route] (ecmascript)"));
var neo4j_driver_core_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/index.js [app-route] (ecmascript)");
var BOLT_PROTOCOL_V5_4 = neo4j_driver_core_1.internal.constants.BOLT_PROTOCOL_V5_4;
var BoltProtocol = function(_super) {
    __extends(BoltProtocol, _super);
    function BoltProtocol() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(BoltProtocol.prototype, "version", {
        get: function() {
            return BOLT_PROTOCOL_V5_4;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BoltProtocol.prototype, "transformer", {
        get: function() {
            var _this = this;
            if (this._transformer === undefined) {
                this._transformer = new transformer_1.default(Object.values(bolt_protocol_v5x4_transformer_1.default).map(function(create) {
                    return create(_this._config, _this._log);
                }));
            }
            return this._transformer;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Send a TELEMETRY through the underlying connection.
     *
     * @param {object} param0 Message params
     * @param {number} param0.api The API called
     * @param {object} param1 Configuration and callbacks callbacks
     * @param {function()} param1.onCompleted Called when completed
     * @param {function()} param1.onError Called when error
     * @return {StreamObserver} the stream observer that monitors the corresponding server response.
     */ BoltProtocol.prototype.telemetry = function(_a, _b) {
        var api = _a.api;
        var _c = _b === void 0 ? {} : _b, onError = _c.onError, onCompleted = _c.onCompleted;
        var observer = new stream_observers_1.TelemetryObserver({
            onCompleted: onCompleted,
            onError: onError
        });
        this.write(request_message_1.default.telemetry({
            api: api
        }), observer, false);
        return observer;
    };
    return BoltProtocol;
}(bolt_protocol_v5x3_1.default);
exports.default = BoltProtocol;
}),
"[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/bolt-protocol-v5x5.transformer.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
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
var __importDefault = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : {
        "default": mod
    };
};
Object.defineProperty(exports, "__esModule", {
    value: true
});
var bolt_protocol_v5x4_transformer_1 = __importDefault(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/bolt-protocol-v5x4.transformer.js [app-route] (ecmascript)"));
exports.default = __assign({}, bolt_protocol_v5x4_transformer_1.default);
}),
"[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/bolt-protocol-v5x5.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
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
 */ var bolt_protocol_v5x4_1 = __importDefault(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/bolt-protocol-v5x4.js [app-route] (ecmascript)"));
var bolt_protocol_v5x5_transformer_1 = __importDefault(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/bolt-protocol-v5x5.transformer.js [app-route] (ecmascript)"));
var transformer_1 = __importDefault(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/transformer.js [app-route] (ecmascript)"));
var request_message_1 = __importDefault(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/request-message.js [app-route] (ecmascript)"));
var stream_observers_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/stream-observers.js [app-route] (ecmascript)");
var neo4j_driver_core_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/index.js [app-route] (ecmascript)");
var _a = neo4j_driver_core_1.internal.constants, BOLT_PROTOCOL_V5_5 = _a.BOLT_PROTOCOL_V5_5, FETCH_ALL = _a.FETCH_ALL;
var DEFAULT_DIAGNOSTIC_RECORD = Object.freeze({
    OPERATION: '',
    OPERATION_CODE: '0',
    CURRENT_SCHEMA: '/'
});
var BoltProtocol = function(_super) {
    __extends(BoltProtocol, _super);
    function BoltProtocol() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(BoltProtocol.prototype, "version", {
        get: function() {
            return BOLT_PROTOCOL_V5_5;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BoltProtocol.prototype, "transformer", {
        get: function() {
            var _this = this;
            if (this._transformer === undefined) {
                this._transformer = new transformer_1.default(Object.values(bolt_protocol_v5x5_transformer_1.default).map(function(create) {
                    return create(_this._config, _this._log);
                }));
            }
            return this._transformer;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Initialize a connection with the server
     *
     * @param {Object} args The params
     * @param {string} args.userAgent The user agent
     * @param {any} args.authToken The auth token
     * @param {NotificationFilter} args.notificationFilter The notification filters.
     * @param {function(error)} args.onError On error callback
     * @param {function(onComplete)} args.onComplete On complete callback
     * @returns {LoginObserver} The Login observer
     */ BoltProtocol.prototype.initialize = function(_a) {
        var _this = this;
        var _b = _a === void 0 ? {} : _a, userAgent = _b.userAgent, boltAgent = _b.boltAgent, authToken = _b.authToken, notificationFilter = _b.notificationFilter, onError = _b.onError, onComplete = _b.onComplete;
        var state = {};
        var observer = new stream_observers_1.LoginObserver({
            onError: function(error) {
                return _this._onLoginError(error, onError);
            },
            onCompleted: function(metadata) {
                state.metadata = metadata;
                return _this._onLoginCompleted(metadata);
            }
        });
        this.write(request_message_1.default.hello5x5(userAgent, boltAgent, notificationFilter, this._serversideRouting), observer, false);
        return this.logon({
            authToken: authToken,
            onComplete: function(metadata) {
                return onComplete(__assign(__assign({}, metadata), state.metadata));
            },
            onError: onError,
            flush: true
        });
    };
    BoltProtocol.prototype.beginTransaction = function(_a) {
        var _b = _a === void 0 ? {} : _a, bookmarks = _b.bookmarks, txConfig = _b.txConfig, database = _b.database, mode = _b.mode, impersonatedUser = _b.impersonatedUser, notificationFilter = _b.notificationFilter, beforeError = _b.beforeError, afterError = _b.afterError, beforeComplete = _b.beforeComplete, afterComplete = _b.afterComplete;
        var observer = new stream_observers_1.ResultStreamObserver({
            server: this._server,
            beforeError: beforeError,
            afterError: afterError,
            beforeComplete: beforeComplete,
            afterComplete: afterComplete
        });
        observer.prepareToHandleSingleResponse();
        this.write(request_message_1.default.begin5x5({
            bookmarks: bookmarks,
            txConfig: txConfig,
            database: database,
            mode: mode,
            impersonatedUser: impersonatedUser,
            notificationFilter: notificationFilter
        }), observer, true);
        return observer;
    };
    BoltProtocol.prototype.run = function(query, parameters, _a) {
        var _b = _a === void 0 ? {} : _a, bookmarks = _b.bookmarks, txConfig = _b.txConfig, database = _b.database, mode = _b.mode, impersonatedUser = _b.impersonatedUser, notificationFilter = _b.notificationFilter, beforeKeys = _b.beforeKeys, afterKeys = _b.afterKeys, beforeError = _b.beforeError, afterError = _b.afterError, beforeComplete = _b.beforeComplete, afterComplete = _b.afterComplete, _c = _b.flush, flush = _c === void 0 ? true : _c, _d = _b.reactive, reactive = _d === void 0 ? false : _d, _e = _b.fetchSize, fetchSize = _e === void 0 ? FETCH_ALL : _e, _f = _b.highRecordWatermark, highRecordWatermark = _f === void 0 ? Number.MAX_VALUE : _f, _g = _b.lowRecordWatermark, lowRecordWatermark = _g === void 0 ? Number.MAX_VALUE : _g;
        var observer = new stream_observers_1.ResultStreamObserver({
            server: this._server,
            reactive: reactive,
            fetchSize: fetchSize,
            moreFunction: this._requestMore.bind(this),
            discardFunction: this._requestDiscard.bind(this),
            beforeKeys: beforeKeys,
            afterKeys: afterKeys,
            beforeError: beforeError,
            afterError: afterError,
            beforeComplete: beforeComplete,
            afterComplete: afterComplete,
            highRecordWatermark: highRecordWatermark,
            lowRecordWatermark: lowRecordWatermark,
            enrichMetadata: this._enrichMetadata
        });
        var flushRun = reactive;
        this.write(request_message_1.default.runWithMetadata5x5(query, parameters, {
            bookmarks: bookmarks,
            txConfig: txConfig,
            database: database,
            mode: mode,
            impersonatedUser: impersonatedUser,
            notificationFilter: notificationFilter
        }), observer, flushRun && flush);
        if (!reactive) {
            this.write(request_message_1.default.pull({
                n: fetchSize
            }), observer, flush);
        }
        return observer;
    };
    /**
     *
     * @param {object} metadata
     * @returns {object}
     */ BoltProtocol.prototype._enrichMetadata = function(metadata) {
        if (Array.isArray(metadata.statuses)) {
            metadata.statuses = metadata.statuses.map(function(status) {
                return __assign(__assign({}, status), {
                    description: status.neo4j_code != null ? status.status_description : status.description,
                    diagnostic_record: status.diagnostic_record !== null ? __assign(__assign({}, DEFAULT_DIAGNOSTIC_RECORD), status.diagnostic_record) : null
                });
            });
        }
        return metadata;
    };
    return BoltProtocol;
}(bolt_protocol_v5x4_1.default);
exports.default = BoltProtocol;
}),
"[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/bolt-protocol-v5x6.transformer.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
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
var __importDefault = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : {
        "default": mod
    };
};
Object.defineProperty(exports, "__esModule", {
    value: true
});
var bolt_protocol_v5x5_transformer_1 = __importDefault(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/bolt-protocol-v5x5.transformer.js [app-route] (ecmascript)"));
exports.default = __assign({}, bolt_protocol_v5x5_transformer_1.default);
}),
"[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/bolt-protocol-v5x6.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
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
 */ var bolt_protocol_v5x5_1 = __importDefault(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/bolt-protocol-v5x5.js [app-route] (ecmascript)"));
var bolt_protocol_v5x6_transformer_1 = __importDefault(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/bolt-protocol-v5x6.transformer.js [app-route] (ecmascript)"));
var transformer_1 = __importDefault(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/transformer.js [app-route] (ecmascript)"));
var neo4j_driver_core_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/index.js [app-route] (ecmascript)");
var BOLT_PROTOCOL_V5_6 = neo4j_driver_core_1.internal.constants.BOLT_PROTOCOL_V5_6;
var DEFAULT_DIAGNOSTIC_RECORD = Object.freeze({
    OPERATION: '',
    OPERATION_CODE: '0',
    CURRENT_SCHEMA: '/'
});
var BoltProtocol = function(_super) {
    __extends(BoltProtocol, _super);
    function BoltProtocol() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(BoltProtocol.prototype, "version", {
        get: function() {
            return BOLT_PROTOCOL_V5_6;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BoltProtocol.prototype, "transformer", {
        get: function() {
            var _this = this;
            if (this._transformer === undefined) {
                this._transformer = new transformer_1.default(Object.values(bolt_protocol_v5x6_transformer_1.default).map(function(create) {
                    return create(_this._config, _this._log);
                }));
            }
            return this._transformer;
        },
        enumerable: false,
        configurable: true
    });
    /**
     *
     * @param {object} metadata
     * @returns {object}
     */ BoltProtocol.prototype._enrichMetadata = function(metadata) {
        if (Array.isArray(metadata.statuses)) {
            metadata.statuses = metadata.statuses.map(function(status) {
                return __assign(__assign({}, status), {
                    diagnostic_record: status.diagnostic_record !== null ? __assign(__assign({}, DEFAULT_DIAGNOSTIC_RECORD), status.diagnostic_record) : null
                });
            });
        }
        return metadata;
    };
    return BoltProtocol;
}(bolt_protocol_v5x5_1.default);
exports.default = BoltProtocol;
}),
"[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/bolt-protocol-v5x7.transformer.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
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
var __importDefault = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : {
        "default": mod
    };
};
Object.defineProperty(exports, "__esModule", {
    value: true
});
var bolt_protocol_v5x6_transformer_1 = __importDefault(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/bolt-protocol-v5x6.transformer.js [app-route] (ecmascript)"));
exports.default = __assign({}, bolt_protocol_v5x6_transformer_1.default);
}),
"[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/bolt-protocol-v5x7.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
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
 */ var bolt_protocol_v5x6_1 = __importDefault(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/bolt-protocol-v5x6.js [app-route] (ecmascript)"));
var bolt_protocol_v5x7_transformer_1 = __importDefault(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/bolt-protocol-v5x7.transformer.js [app-route] (ecmascript)"));
var transformer_1 = __importDefault(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/transformer.js [app-route] (ecmascript)"));
var neo4j_driver_core_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/index.js [app-route] (ecmascript)");
var BOLT_PROTOCOL_V5_7 = neo4j_driver_core_1.internal.constants.BOLT_PROTOCOL_V5_7;
var DEFAULT_DIAGNOSTIC_RECORD = Object.freeze({
    OPERATION: '',
    OPERATION_CODE: '0',
    CURRENT_SCHEMA: '/'
});
var BoltProtocol = function(_super) {
    __extends(BoltProtocol, _super);
    function BoltProtocol() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(BoltProtocol.prototype, "version", {
        get: function() {
            return BOLT_PROTOCOL_V5_7;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BoltProtocol.prototype, "transformer", {
        get: function() {
            var _this = this;
            if (this._transformer === undefined) {
                this._transformer = new transformer_1.default(Object.values(bolt_protocol_v5x7_transformer_1.default).map(function(create) {
                    return create(_this._config, _this._log);
                }));
            }
            return this._transformer;
        },
        enumerable: false,
        configurable: true
    });
    /**
     *
     * @param {object} metadata
     * @returns {object}
     */ BoltProtocol.prototype.enrichErrorMetadata = function(metadata) {
        return __assign(__assign({}, metadata), {
            cause: metadata.cause !== null && metadata.cause !== undefined ? this.enrichErrorMetadata(metadata.cause) : null,
            code: metadata.neo4j_code,
            diagnostic_record: metadata.diagnostic_record !== null ? __assign(__assign({}, DEFAULT_DIAGNOSTIC_RECORD), metadata.diagnostic_record) : null
        });
    };
    return BoltProtocol;
}(bolt_protocol_v5x6_1.default);
exports.default = BoltProtocol;
}),
"[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/bolt-protocol-v5x8.transformer.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
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
var __importDefault = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : {
        "default": mod
    };
};
Object.defineProperty(exports, "__esModule", {
    value: true
});
var bolt_protocol_v5x7_transformer_1 = __importDefault(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/bolt-protocol-v5x7.transformer.js [app-route] (ecmascript)"));
exports.default = __assign({}, bolt_protocol_v5x7_transformer_1.default);
}),
"[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/bolt-protocol-v5x8.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
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
var __importDefault = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : {
        "default": mod
    };
};
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
 */ var bolt_protocol_v5x7_1 = __importDefault(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/bolt-protocol-v5x7.js [app-route] (ecmascript)"));
var bolt_protocol_v5x8_transformer_1 = __importDefault(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/bolt-protocol-v5x8.transformer.js [app-route] (ecmascript)"));
var transformer_1 = __importDefault(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/transformer.js [app-route] (ecmascript)"));
var request_message_1 = __importDefault(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/request-message.js [app-route] (ecmascript)"));
var stream_observers_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/stream-observers.js [app-route] (ecmascript)");
var neo4j_driver_core_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/index.js [app-route] (ecmascript)");
var _a = neo4j_driver_core_1.internal.constants, BOLT_PROTOCOL_V5_8 = _a.BOLT_PROTOCOL_V5_8, FETCH_ALL = _a.FETCH_ALL;
var BoltProtocol = function(_super) {
    __extends(BoltProtocol, _super);
    function BoltProtocol() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(BoltProtocol.prototype, "version", {
        get: function() {
            return BOLT_PROTOCOL_V5_8;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BoltProtocol.prototype, "transformer", {
        get: function() {
            var _this = this;
            if (this._transformer === undefined) {
                this._transformer = new transformer_1.default(Object.values(bolt_protocol_v5x8_transformer_1.default).map(function(create) {
                    return create(_this._config, _this._log);
                }));
            }
            return this._transformer;
        },
        enumerable: false,
        configurable: true
    });
    BoltProtocol.prototype.run = function(query, parameters, _a) {
        var _b = _a === void 0 ? {} : _a, bookmarks = _b.bookmarks, txConfig = _b.txConfig, database = _b.database, mode = _b.mode, impersonatedUser = _b.impersonatedUser, notificationFilter = _b.notificationFilter, beforeKeys = _b.beforeKeys, afterKeys = _b.afterKeys, beforeError = _b.beforeError, afterError = _b.afterError, beforeComplete = _b.beforeComplete, afterComplete = _b.afterComplete, _c = _b.flush, flush = _c === void 0 ? true : _c, _d = _b.reactive, reactive = _d === void 0 ? false : _d, _e = _b.fetchSize, fetchSize = _e === void 0 ? FETCH_ALL : _e, _f = _b.highRecordWatermark, highRecordWatermark = _f === void 0 ? Number.MAX_VALUE : _f, _g = _b.lowRecordWatermark, lowRecordWatermark = _g === void 0 ? Number.MAX_VALUE : _g, onDb = _b.onDb;
        var observer = new stream_observers_1.ResultStreamObserver({
            server: this._server,
            reactive: reactive,
            fetchSize: fetchSize,
            moreFunction: this._requestMore.bind(this),
            discardFunction: this._requestDiscard.bind(this),
            beforeKeys: beforeKeys,
            afterKeys: afterKeys,
            beforeError: beforeError,
            afterError: afterError,
            beforeComplete: beforeComplete,
            afterComplete: afterComplete,
            highRecordWatermark: highRecordWatermark,
            lowRecordWatermark: lowRecordWatermark,
            enrichMetadata: this._enrichMetadata,
            onDb: onDb
        });
        var flushRun = reactive;
        this.write(request_message_1.default.runWithMetadata5x5(query, parameters, {
            bookmarks: bookmarks,
            txConfig: txConfig,
            database: database,
            mode: mode,
            impersonatedUser: impersonatedUser,
            notificationFilter: notificationFilter
        }), observer, flushRun && flush);
        if (!reactive) {
            this.write(request_message_1.default.pull({
                n: fetchSize
            }), observer, flush);
        }
        return observer;
    };
    return BoltProtocol;
}(bolt_protocol_v5x7_1.default);
exports.default = BoltProtocol;
}),
"[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/bolt-protocol-v6x0.transformer.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
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
var __importDefault = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : {
        "default": mod
    };
};
Object.defineProperty(exports, "__esModule", {
    value: true
});
var bolt_protocol_v5x8_transformer_1 = __importDefault(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/bolt-protocol-v5x8.transformer.js [app-route] (ecmascript)"));
var transformer_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/transformer.js [app-route] (ecmascript)");
var packstream_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/packstream/index.js [app-route] (ecmascript)");
var neo4j_driver_core_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/index.js [app-route] (ecmascript)");
var VECTOR = 0x56;
var FLOAT_32 = 0xc6;
var FLOAT_64 = 0xc1;
var INT_8 = 0xc8;
var INT_16 = 0xc9;
var INT_32 = 0xca;
var INT_64 = 0xcb;
var UNSUPPORTED = 0x3F;
var typeToTypeMarker = {
    INT8: INT_8,
    INT16: INT_16,
    INT32: INT_32,
    INT64: INT_64,
    FLOAT32: FLOAT_32,
    FLOAT64: FLOAT_64
};
function createVectorTransformer() {
    return new transformer_1.TypeTransformer({
        signature: VECTOR,
        isTypeInstance: function(object) {
            return (0, neo4j_driver_core_1.isVector)(object);
        },
        toStructure: function(vector) {
            var typeMarker = typeToTypeMarker[vector.getType()];
            if (typeMarker === undefined) {
                throw (0, neo4j_driver_core_1.newError)("Vector object has unknown type: ".concat(vector.getType()));
            }
            var buffer = fixBufferEndianness(typeMarker, vector.asTypedArray().buffer);
            var struct = new packstream_1.structure.Structure(VECTOR, [
                Int8Array.from([
                    typeMarker
                ]),
                new Int8Array(buffer)
            ]);
            return struct;
        },
        fromStructure: function(structure) {
            var typeMarker = Uint8Array.from(structure.fields[0])[0];
            var byteArray = structure.fields[1];
            var buffer = fixBufferEndianness(typeMarker, byteArray.buffer);
            switch(typeMarker){
                case INT_8:
                    return new neo4j_driver_core_1.Vector(new Int8Array(buffer));
                case INT_16:
                    return new neo4j_driver_core_1.Vector(new Int16Array(buffer));
                case INT_32:
                    return new neo4j_driver_core_1.Vector(new Int32Array(buffer));
                case INT_64:
                    return new neo4j_driver_core_1.Vector(new BigInt64Array(buffer));
                case FLOAT_32:
                    return new neo4j_driver_core_1.Vector(new Float32Array(buffer));
                case FLOAT_64:
                    return new neo4j_driver_core_1.Vector(new Float64Array(buffer));
                default:
                    throw (0, neo4j_driver_core_1.newError)("Received Vector structure with unsupported type marker: ".concat(typeMarker));
            }
        }
    });
}
function fixBufferEndianness(typeMarker, buffer) {
    var isLittleEndian = checkLittleEndian();
    if (isLittleEndian) {
        var setview = new DataView(new ArrayBuffer(buffer.byteLength));
        // we want exact byte accuracy, so we cannot simply get the value from the typed array
        var getview = new DataView(buffer);
        var set = void 0;
        var get = void 0;
        var elementSize = void 0;
        switch(typeMarker){
            case INT_8:
                elementSize = 1;
                set = setview.setInt8.bind(setview);
                get = getview.getInt8.bind(getview);
                break;
            case INT_16:
                elementSize = 2;
                set = setview.setInt16.bind(setview);
                get = getview.getInt16.bind(getview);
                break;
            case INT_32:
                elementSize = 4;
                set = setview.setInt32.bind(setview);
                get = getview.getInt32.bind(getview);
                break;
            case INT_64:
                elementSize = 8;
                set = setview.setBigInt64.bind(setview);
                get = getview.getBigInt64.bind(getview);
                break;
            case FLOAT_32:
                elementSize = 4;
                set = setview.setInt32.bind(setview);
                get = getview.getInt32.bind(getview);
                break;
            case FLOAT_64:
                elementSize = 8;
                set = setview.setBigInt64.bind(setview);
                get = getview.getBigInt64.bind(getview);
                break;
            default:
                throw (0, neo4j_driver_core_1.newError)("Vector is of unsupported type ".concat(typeMarker));
        }
        for(var i = 0; i < buffer.byteLength; i += elementSize){
            set(i, get(i, isLittleEndian));
        }
        return setview.buffer;
    } else {
        return buffer;
    }
}
function checkLittleEndian() {
    var dataview = new DataView(new ArrayBuffer(2));
    dataview.setInt16(0, 1000, true);
    var typeArray = new Int16Array(dataview.buffer);
    return typeArray[0] === 1000;
}
function createUnsupportedTypeTransformer() {
    return new transformer_1.TypeTransformer({
        signature: UNSUPPORTED,
        isTypeInstance: function(object) {
            return (0, neo4j_driver_core_1.isUnsupportedType)(object);
        },
        toStructure: function(_) {
            throw (0, neo4j_driver_core_1.newError)('UnsupportedType object can not be transmitted');
        },
        fromStructure: function(structure) {
            return new neo4j_driver_core_1.UnsupportedType(structure.fields[0], structure.fields[1], structure.fields[2], structure.fields[3].message);
        }
    });
}
exports.default = __assign(__assign({}, bolt_protocol_v5x8_transformer_1.default), {
    createVectorTransformer: createVectorTransformer,
    createUnsupportedTypeTransformer: createUnsupportedTypeTransformer
});
}),
"[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/bolt-protocol-v6x0.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
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
var __importDefault = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : {
        "default": mod
    };
};
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
 */ var bolt_protocol_v5x8_1 = __importDefault(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/bolt-protocol-v5x8.js [app-route] (ecmascript)"));
var bolt_protocol_v6x0_transformer_1 = __importDefault(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/bolt-protocol-v6x0.transformer.js [app-route] (ecmascript)"));
var transformer_1 = __importDefault(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/transformer.js [app-route] (ecmascript)"));
var neo4j_driver_core_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/index.js [app-route] (ecmascript)");
var BOLT_PROTOCOL_V6_0 = neo4j_driver_core_1.internal.constants.BOLT_PROTOCOL_V6_0;
var BoltProtocol = function(_super) {
    __extends(BoltProtocol, _super);
    function BoltProtocol() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(BoltProtocol.prototype, "version", {
        get: function() {
            return BOLT_PROTOCOL_V6_0;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BoltProtocol.prototype, "transformer", {
        get: function() {
            var _this = this;
            if (this._transformer === undefined) {
                this._transformer = new transformer_1.default(Object.values(bolt_protocol_v6x0_transformer_1.default).map(function(create) {
                    return create(_this._config, _this._log);
                }));
            }
            return this._transformer;
        },
        enumerable: false,
        configurable: true
    });
    return BoltProtocol;
}(bolt_protocol_v5x8_1.default);
exports.default = BoltProtocol;
}),
"[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/response-handler.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
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
 */ var neo4j_driver_core_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/index.js [app-route] (ecmascript)");
// Signature bytes for each response message type
var SUCCESS = 0x70; // 0111 0000 // SUCCESS <metadata>
var RECORD = 0x71; // 0111 0001 // RECORD <value>
var IGNORED = 0x7e; // 0111 1110 // IGNORED <metadata>
var FAILURE = 0x7f; // 0111 1111 // FAILURE <metadata>
function NO_OP() {}
function NO_OP_IDENTITY(subject) {
    return subject;
}
var NO_OP_OBSERVER = {
    onNext: NO_OP,
    onCompleted: NO_OP,
    onError: NO_OP
};
/**
 * Treat the protocol responses and notify the observers
 */ var ResponseHandler = function() {
    /**
     * Called when something went wrong with the connectio
     * @callback ResponseHandler~Observer~OnErrorApplyTransformation
     * @param {any} error The error
     * @returns {any} The new error
     */ /**
     * Called when something went wrong with the connectio
     * @callback ResponseHandler~Observer~OnError
     * @param {any} error The error
     */ /**
     * Called when something went wrong with the connectio
     * @callback ResponseHandler~MetadataTransformer
     * @param {any} metadata The metadata got onSuccess
     * @returns {any} The transformed metadata
     */ /**
     * @typedef {Object} ResponseHandler~Observer
     * @property {ResponseHandler~Observer~OnError} onError Invoke when a connection error occurs
     * @property {ResponseHandler~Observer~OnError} onFailure Invoke when a protocol failure occurs
     * @property {ResponseHandler~Observer~OnErrorApplyTransformation} onErrorApplyTransformation Invoke just after the failure occurs,
     *  before notify to respective observer. This method should transform the failure reason to the approprited one.
     */ /**
     * Constructor
     * @param {Object} param The params
     * @param {ResponseHandler~MetadataTransformer} transformMetadata Transform metadata when the SUCCESS is received.
     * @param {Channel} channel The channel used to exchange messages
     * @param {Logger} log The logger
     * @param {ResponseHandler~Observer} observer Object which will be notified about errors
     */ function ResponseHandler(_a) {
        var _b = _a === void 0 ? {} : _a, transformMetadata = _b.transformMetadata, enrichErrorMetadata = _b.enrichErrorMetadata, log = _b.log, observer = _b.observer;
        this._pendingObservers = [];
        this._log = log;
        this._transformMetadata = transformMetadata || NO_OP_IDENTITY;
        this._enrichErrorMetadata = enrichErrorMetadata || NO_OP_IDENTITY;
        this._observer = Object.assign({
            onObserversCountChange: NO_OP,
            onError: NO_OP,
            onFailure: NO_OP,
            onErrorApplyTransformation: NO_OP_IDENTITY
        }, observer);
    }
    Object.defineProperty(ResponseHandler.prototype, "currentFailure", {
        get: function() {
            return this._currentFailure;
        },
        enumerable: false,
        configurable: true
    });
    ResponseHandler.prototype.handleResponse = function(msg) {
        var payload = msg.fields[0];
        switch(msg.signature){
            case RECORD:
                if (this._log.isDebugEnabled()) {
                    this._log.debug("S: RECORD ".concat(neo4j_driver_core_1.json.stringify(msg)));
                }
                this._currentObserver.onNext(payload);
                break;
            case SUCCESS:
                if (this._log.isDebugEnabled()) {
                    this._log.debug("S: SUCCESS ".concat(neo4j_driver_core_1.json.stringify(msg)));
                }
                try {
                    var metadata = this._transformMetadata(payload);
                    this._currentObserver.onCompleted(metadata);
                } finally{
                    this._updateCurrentObserver();
                }
                break;
            case FAILURE:
                if (this._log.isDebugEnabled()) {
                    this._log.debug("S: FAILURE ".concat(neo4j_driver_core_1.json.stringify(msg)));
                }
                try {
                    this._currentFailure = this._handleErrorPayload(this._enrichErrorMetadata(payload));
                    this._currentObserver.onError(this._currentFailure);
                } finally{
                    this._updateCurrentObserver();
                    // Things are now broken. Pending observers will get FAILURE messages routed until we are done handling this failure.
                    this._observer.onFailure(this._currentFailure);
                }
                break;
            case IGNORED:
                if (this._log.isDebugEnabled()) {
                    this._log.debug("S: IGNORED ".concat(neo4j_driver_core_1.json.stringify(msg)));
                }
                try {
                    if (this._currentFailure && this._currentObserver.onError) {
                        this._currentObserver.onError(this._currentFailure);
                    } else if (this._currentObserver.onError) {
                        this._currentObserver.onError((0, neo4j_driver_core_1.newError)('Ignored either because of an error or RESET'));
                    }
                } finally{
                    this._updateCurrentObserver();
                }
                break;
            default:
                this._observer.onError((0, neo4j_driver_core_1.newError)('Unknown Bolt protocol message: ' + msg));
        }
    };
    /*
     * Pop next pending observer form the list of observers and make it current observer.
     * @protected
     */ ResponseHandler.prototype._updateCurrentObserver = function() {
        this._currentObserver = this._pendingObservers.shift();
        this._observer.onObserversCountChange(this._observersCount);
    };
    Object.defineProperty(ResponseHandler.prototype, "_observersCount", {
        get: function() {
            return this._currentObserver == null ? this._pendingObservers.length : this._pendingObservers.length + 1;
        },
        enumerable: false,
        configurable: true
    });
    ResponseHandler.prototype._queueObserver = function(observer) {
        observer = observer || NO_OP_OBSERVER;
        observer.onCompleted = observer.onCompleted || NO_OP;
        observer.onError = observer.onError || NO_OP;
        observer.onNext = observer.onNext || NO_OP;
        if (this._currentObserver === undefined) {
            this._currentObserver = observer;
        } else {
            this._pendingObservers.push(observer);
        }
        this._observer.onObserversCountChange(this._observersCount);
        return true;
    };
    ResponseHandler.prototype._notifyErrorToObservers = function(error) {
        if (this._currentObserver && this._currentObserver.onError) {
            this._currentObserver.onError(error);
        }
        while(this._pendingObservers.length > 0){
            var observer = this._pendingObservers.shift();
            if (observer && observer.onError) {
                observer.onError(error);
            }
        }
    };
    ResponseHandler.prototype.hasOngoingObservableRequests = function() {
        return this._currentObserver != null || this._pendingObservers.length > 0;
    };
    ResponseHandler.prototype._resetFailure = function() {
        this._currentFailure = null;
    };
    ResponseHandler.prototype._handleErrorPayload = function(payload) {
        var standardizedCode = _standardizeCode(payload.code);
        var cause = payload.cause != null ? this._handleErrorCause(payload.cause) : undefined;
        var error = (0, neo4j_driver_core_1.newError)(payload.message, standardizedCode, cause, payload.gql_status, payload.description, payload.diagnostic_record);
        return this._observer.onErrorApplyTransformation(error);
    };
    ResponseHandler.prototype._handleErrorCause = function(payload) {
        var cause = payload.cause != null ? this._handleErrorCause(payload.cause) : undefined;
        var error = (0, neo4j_driver_core_1.newGQLError)(payload.message, cause, payload.gql_status, payload.description, payload.diagnostic_record);
        return this._observer.onErrorApplyTransformation(error);
    };
    return ResponseHandler;
}();
exports.default = ResponseHandler;
/**
 * Standardize error classification that are different between 5.x and previous versions.
 *
 * The transient error were clean-up for being retrieable and because of this
 * `Terminated` and `LockClientStopped` were reclassified as `ClientError`.
 *
 * @param {string} code
 * @returns {string} the standardized error code
 */ function _standardizeCode(code) {
    if (code === 'Neo.TransientError.Transaction.Terminated') {
        return 'Neo.ClientError.Transaction.Terminated';
    } else if (code === 'Neo.TransientError.Transaction.LockClientStopped') {
        return 'Neo.ClientError.Transaction.LockClientStopped';
    }
    return code;
}
}),
"[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/create.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
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
 */ var __importDefault = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : {
        "default": mod
    };
};
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = create;
var neo4j_driver_core_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/index.js [app-route] (ecmascript)");
var bolt_protocol_v1_1 = __importDefault(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/bolt-protocol-v1.js [app-route] (ecmascript)"));
var bolt_protocol_v2_1 = __importDefault(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/bolt-protocol-v2.js [app-route] (ecmascript)"));
var bolt_protocol_v3_1 = __importDefault(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/bolt-protocol-v3.js [app-route] (ecmascript)"));
var bolt_protocol_v4x0_1 = __importDefault(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/bolt-protocol-v4x0.js [app-route] (ecmascript)"));
var bolt_protocol_v4x1_1 = __importDefault(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/bolt-protocol-v4x1.js [app-route] (ecmascript)"));
var bolt_protocol_v4x2_1 = __importDefault(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/bolt-protocol-v4x2.js [app-route] (ecmascript)"));
var bolt_protocol_v4x3_1 = __importDefault(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/bolt-protocol-v4x3.js [app-route] (ecmascript)"));
var bolt_protocol_v4x4_1 = __importDefault(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/bolt-protocol-v4x4.js [app-route] (ecmascript)"));
var bolt_protocol_v5x0_1 = __importDefault(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/bolt-protocol-v5x0.js [app-route] (ecmascript)"));
var bolt_protocol_v5x1_1 = __importDefault(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/bolt-protocol-v5x1.js [app-route] (ecmascript)"));
var bolt_protocol_v5x2_1 = __importDefault(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/bolt-protocol-v5x2.js [app-route] (ecmascript)"));
var bolt_protocol_v5x3_1 = __importDefault(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/bolt-protocol-v5x3.js [app-route] (ecmascript)"));
var bolt_protocol_v5x4_1 = __importDefault(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/bolt-protocol-v5x4.js [app-route] (ecmascript)"));
var bolt_protocol_v5x5_1 = __importDefault(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/bolt-protocol-v5x5.js [app-route] (ecmascript)"));
var bolt_protocol_v5x6_1 = __importDefault(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/bolt-protocol-v5x6.js [app-route] (ecmascript)"));
var bolt_protocol_v5x7_1 = __importDefault(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/bolt-protocol-v5x7.js [app-route] (ecmascript)"));
var bolt_protocol_v5x8_1 = __importDefault(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/bolt-protocol-v5x8.js [app-route] (ecmascript)"));
var bolt_protocol_v6x0_1 = __importDefault(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/bolt-protocol-v6x0.js [app-route] (ecmascript)"));
// eslint-disable-next-line no-unused-vars
var channel_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/channel/index.js [app-route] (ecmascript)");
var response_handler_1 = __importDefault(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/response-handler.js [app-route] (ecmascript)"));
/**
 * Creates a protocol with a given version
 *
 * @param {object} config
 * @param {number} config.version The version of the protocol
 * @param {channel} config.channel The channel
 * @param {Chunker} config.chunker The chunker
 * @param {Dechunker} config.dechunker The dechunker
 * @param {Logger} config.log The logger
 * @param {ResponseHandler~Observer} config.observer Observer
 * @param {boolean} config.disableLosslessIntegers Disable the lossless integers
 * @param {boolean} packstreamConfig.useBigInt if this connection should convert all received integers to native BigInt numbers.
 * @param {boolean} config.serversideRouting It's using server side routing
 */ function create(_a) {
    var _b = _a === void 0 ? {} : _a, version = _b.version, chunker = _b.chunker, dechunker = _b.dechunker, channel = _b.channel, disableLosslessIntegers = _b.disableLosslessIntegers, useBigInt = _b.useBigInt, serversideRouting = _b.serversideRouting, server = _b.server, log = _b.log, observer = _b.observer;
    var createResponseHandler = function(protocol) {
        var responseHandler = new response_handler_1.default({
            transformMetadata: protocol.transformMetadata.bind(protocol),
            enrichErrorMetadata: protocol.enrichErrorMetadata.bind(protocol),
            log: log,
            observer: observer
        });
        // reset the error handler to just handle errors and forget about the handshake promise
        channel.onerror = observer.onError.bind(observer);
        // Ok, protocol running. Simply forward all messages to the dechunker
        channel.onmessage = function(buf) {
            return dechunker.write(buf);
        };
        // setup dechunker to dechunk messages and forward them to the message handler
        dechunker.onmessage = function(buf) {
            try {
                responseHandler.handleResponse(protocol.unpack(buf));
            } catch (e) {
                return observer.onError(e);
            }
        };
        return responseHandler;
    };
    return createProtocol(version, server, chunker, {
        disableLosslessIntegers: disableLosslessIntegers,
        useBigInt: useBigInt
    }, serversideRouting, createResponseHandler, observer.onProtocolError.bind(observer), log);
}
function createProtocol(version, server, chunker, packingConfig, serversideRouting, createResponseHandler, onProtocolError, log) {
    if (!(version instanceof neo4j_driver_core_1.ProtocolVersion) || version === undefined || version === null) {
        throw (0, neo4j_driver_core_1.newError)('Unknown Bolt protocol version: ' + version);
    }
    switch(true){
        case version.isEqualTo({
            major: 1,
            minor: 0
        }):
            return new bolt_protocol_v1_1.default(server, chunker, packingConfig, createResponseHandler, log, onProtocolError);
        case version.isEqualTo({
            major: 2,
            minor: 0
        }):
            return new bolt_protocol_v2_1.default(server, chunker, packingConfig, createResponseHandler, log, onProtocolError);
        case version.isEqualTo({
            major: 3,
            minor: 0
        }):
            return new bolt_protocol_v3_1.default(server, chunker, packingConfig, createResponseHandler, log, onProtocolError);
        case version.isEqualTo({
            major: 4,
            minor: 0
        }):
            return new bolt_protocol_v4x0_1.default(server, chunker, packingConfig, createResponseHandler, log, onProtocolError);
        case version.isEqualTo({
            major: 4,
            minor: 1
        }):
            return new bolt_protocol_v4x1_1.default(server, chunker, packingConfig, createResponseHandler, log, onProtocolError, serversideRouting);
        case version.isEqualTo({
            major: 4,
            minor: 2
        }):
            return new bolt_protocol_v4x2_1.default(server, chunker, packingConfig, createResponseHandler, log, onProtocolError, serversideRouting);
        case version.isEqualTo({
            major: 4,
            minor: 3
        }):
            return new bolt_protocol_v4x3_1.default(server, chunker, packingConfig, createResponseHandler, log, onProtocolError, serversideRouting);
        case version.isEqualTo({
            major: 4,
            minor: 4
        }):
            return new bolt_protocol_v4x4_1.default(server, chunker, packingConfig, createResponseHandler, log, onProtocolError, serversideRouting);
        case version.isEqualTo({
            major: 5,
            minor: 0
        }):
            return new bolt_protocol_v5x0_1.default(server, chunker, packingConfig, createResponseHandler, log, onProtocolError, serversideRouting);
        case version.isEqualTo({
            major: 5,
            minor: 1
        }):
            return new bolt_protocol_v5x1_1.default(server, chunker, packingConfig, createResponseHandler, log, onProtocolError, serversideRouting);
        case version.isEqualTo({
            major: 5,
            minor: 2
        }):
            return new bolt_protocol_v5x2_1.default(server, chunker, packingConfig, createResponseHandler, log, onProtocolError, serversideRouting);
        case version.isEqualTo({
            major: 5,
            minor: 3
        }):
            return new bolt_protocol_v5x3_1.default(server, chunker, packingConfig, createResponseHandler, log, onProtocolError, serversideRouting);
        case version.isEqualTo({
            major: 5,
            minor: 4
        }):
            return new bolt_protocol_v5x4_1.default(server, chunker, packingConfig, createResponseHandler, log, onProtocolError, serversideRouting);
        case version.isEqualTo({
            major: 5,
            minor: 5
        }):
            return new bolt_protocol_v5x5_1.default(server, chunker, packingConfig, createResponseHandler, log, onProtocolError, serversideRouting);
        case version.isEqualTo({
            major: 5,
            minor: 6
        }):
            return new bolt_protocol_v5x6_1.default(server, chunker, packingConfig, createResponseHandler, log, onProtocolError, serversideRouting);
        case version.isEqualTo({
            major: 5,
            minor: 7
        }):
            return new bolt_protocol_v5x7_1.default(server, chunker, packingConfig, createResponseHandler, log, onProtocolError, serversideRouting);
        case version.isEqualTo({
            major: 5,
            minor: 8
        }):
            return new bolt_protocol_v5x8_1.default(server, chunker, packingConfig, createResponseHandler, log, onProtocolError, serversideRouting);
        case version.isEqualTo({
            major: 6,
            minor: 0
        }):
            return new bolt_protocol_v6x0_1.default(server, chunker, packingConfig, createResponseHandler, log, onProtocolError, serversideRouting);
        default:
            throw (0, neo4j_driver_core_1.newError)('Unknown Bolt protocol version: ' + version);
    }
}
}),
"[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
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
var __exportStar = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__exportStar || function(m, exports1) {
    for(var p in m)if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports1, p)) __createBinding(exports1, m, p);
};
var __importDefault = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : {
        "default": mod
    };
};
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.RawRoutingTable = exports.BoltProtocol = void 0;
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
 */ var handshake_1 = __importDefault(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/handshake.js [app-route] (ecmascript)"));
var create_1 = __importDefault(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/create.js [app-route] (ecmascript)"));
var bolt_protocol_v4x3_1 = __importDefault(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/bolt-protocol-v4x3.js [app-route] (ecmascript)"));
var routing_table_raw_1 = __importDefault(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/routing-table-raw.js [app-route] (ecmascript)"));
__exportStar(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/stream-observers.js [app-route] (ecmascript)"), exports);
exports.BoltProtocol = bolt_protocol_v4x3_1.default;
exports.RawRoutingTable = routing_table_raw_1.default;
exports.default = {
    handshake: handshake_1.default,
    create: create_1.default
};
}),
"[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/connection-provider/connection-provider-single.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
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
var neo4j_driver_core_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/index.js [app-route] (ecmascript)");
var SingleConnectionProvider = function(_super) {
    __extends(SingleConnectionProvider, _super);
    function SingleConnectionProvider(connection) {
        var _this = _super.call(this) || this;
        _this._connection = connection;
        return _this;
    }
    /**
     * See {@link ConnectionProvider} for more information about this method and
     * its arguments.
     */ SingleConnectionProvider.prototype.acquireConnection = function(_a) {
        var _b = _a === void 0 ? {} : _a, accessMode = _b.accessMode, database = _b.database, bookmarks = _b.bookmarks;
        var connection = this._connection;
        this._connection = null;
        return Promise.resolve(connection);
    };
    return SingleConnectionProvider;
}(neo4j_driver_core_1.ConnectionProvider);
exports.default = SingleConnectionProvider;
}),
"[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/connection/connection.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
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
 */ // eslint-disable-next-line no-unused-vars
var bolt_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/index.js [app-route] (ecmascript)");
var neo4j_driver_core_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/index.js [app-route] (ecmascript)");
var Connection = function(_super) {
    __extends(Connection, _super);
    /**
     * @param {ConnectionErrorHandler} errorHandler the error handler
     */ function Connection(errorHandler) {
        var _this = _super.call(this) || this;
        _this._errorHandler = errorHandler;
        return _this;
    }
    Object.defineProperty(Connection.prototype, "id", {
        get: function() {
            throw new Error('not implemented');
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Connection.prototype, "databaseId", {
        get: function() {
            throw new Error('not implemented');
        },
        set: function(value) {
            throw new Error('not implemented');
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Connection.prototype, "authToken", {
        get: function() {
            throw new Error('not implemented');
        },
        set: function(value) {
            throw new Error('not implemented');
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Connection.prototype, "supportsReAuth", {
        get: function() {
            throw new Error('not implemented');
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Connection.prototype, "creationTimestamp", {
        get: function() {
            throw new Error('not implemented');
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Connection.prototype, "idleTimestamp", {
        get: function() {
            throw new Error('not implemented');
        },
        set: function(value) {
            throw new Error('not implemented');
        },
        enumerable: false,
        configurable: true
    });
    /**
     * @returns {BoltProtocol} the underlying bolt protocol assigned to this connection
     */ Connection.prototype.protocol = function() {
        throw new Error('not implemented');
    };
    Object.defineProperty(Connection.prototype, "address", {
        /**
         * @returns {ServerAddress} the server address this connection is opened against
         */ get: function() {
            throw new Error('not implemented');
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Connection.prototype, "version", {
        /**
         * @returns {ServerVersion} the version of the server this connection is connected to
         */ get: function() {
            throw new Error('not implemented');
        },
        set: function(value) {
            throw new Error('not implemented');
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Connection.prototype, "server", {
        get: function() {
            throw new Error('not implemented');
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Connect to the target address, negotiate Bolt protocol and send initialization message.
     * @param {string} userAgent the user agent for this driver.
     * @param {Object} boltAgent the bolt agent for this driver.
     * @param {Object} authToken the object containing auth information.
     * @param {boolean} shouldWaitReAuth whether ot not the connection will wait for re-authentication to happen
     * @return {Promise<Connection>} promise resolved with the current connection if connection is successful. Rejected promise otherwise.
     */ Connection.prototype.connect = function(userAgent, boltAgent, authToken, shouldWaitReAuth) {
        throw new Error('not implemented');
    };
    /**
     * Write a message to the network channel.
     * @param {RequestMessage} message the message to write.
     * @param {ResultStreamObserver} observer the response observer.
     * @param {boolean} flush `true` if flush should happen after the message is written to the buffer.
     */ Connection.prototype.write = function(message, observer, flush) {
        throw new Error('not implemented');
    };
    /**
     * Call close on the channel.
     * @returns {Promise<void>} - A promise that will be resolved when the connection is closed.
     *
     */ Connection.prototype.close = function() {
        throw new Error('not implemented');
    };
    /**
     *
     * @param error
     * @param address
     * @returns {Neo4jError|*}
     */ Connection.prototype.handleAndTransformError = function(error, address) {
        if (this._errorHandler) {
            return this._errorHandler.handleAndTransformError(error, address, this);
        }
        return error;
    };
    return Connection;
}(neo4j_driver_core_1.Connection);
exports.default = Connection;
}),
"[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/connection/connection-channel.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
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
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.createChannelConnection = createChannelConnection;
var channel_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/channel/index.js [app-route] (ecmascript)");
var neo4j_driver_core_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/index.js [app-route] (ecmascript)");
var connection_1 = __importDefault(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/connection/connection.js [app-route] (ecmascript)"));
var bolt_1 = __importDefault(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/index.js [app-route] (ecmascript)"));
var PROTOCOL_ERROR = neo4j_driver_core_1.error.PROTOCOL_ERROR;
var Logger = neo4j_driver_core_1.internal.logger.Logger;
var idGenerator = 0;
/**
 * Crete new connection to the provided address. Returned connection is not connected.
 * @param {ServerAddress} address - the Bolt endpoint to connect to.
 * @param {Object} config - the driver configuration.
 * @param {ConnectionErrorHandler} errorHandler - the error handler for connection errors.
 * @param {Logger} log - configured logger.
 * @param {clientCertificate} clientCertificate - configured client certificate
 * @param ssrCallback - callback function used to update the counts of ssr enabled and disabled connections
 * @param createChannel - function taking a channelConfig object and creating a channel with it
 * @return {Connection} - new connection.
 */ function createChannelConnection(address, config, errorHandler, log, clientCertificate, serversideRouting, ssrCallback, createChannel) {
    if (serversideRouting === void 0) {
        serversideRouting = null;
    }
    if (createChannel === void 0) {
        createChannel = function(channelConfig) {
            return new channel_1.Channel(channelConfig);
        };
    }
    var channelConfig = new channel_1.ChannelConfig(address, config, errorHandler.errorCode(), clientCertificate);
    var channel = createChannel(channelConfig);
    return bolt_1.default.handshake(channel, log).then(function(_a) {
        var version = _a.protocolVersion, consumeRemainingBuffer = _a.consumeRemainingBuffer;
        var chunker = new channel_1.Chunker(channel);
        var dechunker = new channel_1.Dechunker();
        var createProtocol = function(conn) {
            return bolt_1.default.create({
                version: version,
                channel: channel,
                chunker: chunker,
                dechunker: dechunker,
                disableLosslessIntegers: config.disableLosslessIntegers,
                useBigInt: config.useBigInt,
                serversideRouting: serversideRouting,
                server: conn.server,
                log: conn.logger,
                observer: {
                    onObserversCountChange: conn._handleOngoingRequestsNumberChange.bind(conn),
                    onError: conn._handleFatalError.bind(conn),
                    onFailure: conn._resetOnFailure.bind(conn),
                    onProtocolError: conn._handleProtocolError.bind(conn),
                    onErrorApplyTransformation: function(error) {
                        return conn.handleAndTransformError(error, conn._address);
                    }
                }
            });
        };
        var connection = new ChannelConnection(channel, errorHandler, address, log, config.disableLosslessIntegers, serversideRouting, chunker, config.notificationFilter, createProtocol, config.telemetryDisabled, ssrCallback);
        // forward all pending bytes to the dechunker
        consumeRemainingBuffer(function(buffer) {
            return dechunker.write(buffer);
        });
        return connection;
    }).catch(function(reason) {
        return channel.close().then(function() {
            throw reason;
        });
    });
}
var ChannelConnection = function(_super) {
    __extends(ChannelConnection, _super);
    /**
     * @constructor
     * @param {Channel} channel - channel with a 'write' function and a 'onmessage' callback property.
     * @param {ConnectionErrorHandler} errorHandler the error handler.
     * @param {ServerAddress} address - the server address to connect to.
     * @param {Logger} log - the configured logger.
     * @param {boolean} disableLosslessIntegers - if this connection should convert all received integers to native JS numbers.
     * @param {Chunker} chunker - the chunker
     * @param protocolSupplier - Bolt protocol supplier
     * @param {boolean} telemetryDisabled - wether telemetry has been disabled in driver config.
     * @param ssrCallback - callback function used to update the counts of ssr enabled and disabled connections.
     */ function ChannelConnection(channel, errorHandler, address, log, disableLosslessIntegers, serversideRouting, chunker, notificationFilter, protocolSupplier, telemetryDisabled, ssrCallback) {
        if (disableLosslessIntegers === void 0) {
            disableLosslessIntegers = false;
        }
        if (serversideRouting === void 0) {
            serversideRouting = null;
        }
        if (ssrCallback === void 0) {
            ssrCallback = function(_) {};
        }
        var _this = _super.call(this, errorHandler) || this;
        _this._authToken = null;
        _this._idle = false;
        _this._reseting = false;
        _this._resetObservers = [];
        _this._id = idGenerator++;
        _this._address = address;
        _this._server = {
            address: address.asHostPort()
        };
        _this._creationTimestamp = Date.now();
        _this._disableLosslessIntegers = disableLosslessIntegers;
        _this._ch = channel;
        _this._chunker = chunker;
        _this._log = createConnectionLogger(_this, log);
        _this._serversideRouting = serversideRouting;
        _this._notificationFilter = notificationFilter;
        _this._telemetryDisabledDriverConfig = telemetryDisabled === true;
        _this._telemetryDisabledConnection = true;
        _this._ssrCallback = ssrCallback;
        // connection from the database, returned in response for HELLO message and might not be available
        _this._dbConnectionId = null;
        // bolt protocol is initially not initialized
        /**
         * @private
         * @type {BoltProtocol}
         */ _this._protocol = protocolSupplier(_this);
        // Set to true on fatal errors, to get this out of connection pool.
        _this._isBroken = false;
        if (_this._log.isDebugEnabled()) {
            _this._log.debug("created towards ".concat(address));
        }
        return _this;
    }
    ChannelConnection.prototype.beginTransaction = function(config) {
        this._sendTelemetryIfEnabled(config);
        return this._protocol.beginTransaction(config);
    };
    ChannelConnection.prototype.run = function(query, parameters, config) {
        this._sendTelemetryIfEnabled(config);
        return this._protocol.run(query, parameters, config);
    };
    ChannelConnection.prototype._sendTelemetryIfEnabled = function(config) {
        if (this._telemetryDisabledConnection || this._telemetryDisabledDriverConfig || config == null || config.apiTelemetryConfig == null) {
            return;
        }
        this._protocol.telemetry({
            api: config.apiTelemetryConfig.api
        }, {
            onCompleted: config.apiTelemetryConfig.onTelemetrySuccess,
            onError: config.beforeError
        });
    };
    ChannelConnection.prototype.commitTransaction = function(config) {
        return this._protocol.commitTransaction(config);
    };
    ChannelConnection.prototype.rollbackTransaction = function(config) {
        return this._protocol.rollbackTransaction(config);
    };
    ChannelConnection.prototype.getProtocolVersion = function() {
        return this._protocol.version;
    };
    Object.defineProperty(ChannelConnection.prototype, "authToken", {
        get: function() {
            return this._authToken;
        },
        set: function(value) {
            this._authToken = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ChannelConnection.prototype, "supportsReAuth", {
        get: function() {
            return this._protocol.supportsReAuth;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ChannelConnection.prototype, "id", {
        get: function() {
            return this._id;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ChannelConnection.prototype, "databaseId", {
        get: function() {
            return this._dbConnectionId;
        },
        set: function(value) {
            this._dbConnectionId = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ChannelConnection.prototype, "idleTimestamp", {
        get: function() {
            return this._idleTimestamp;
        },
        set: function(value) {
            this._idleTimestamp = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ChannelConnection.prototype, "creationTimestamp", {
        get: function() {
            return this._creationTimestamp;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Send initialization message.
     * @param {string} userAgent the user agent for this driver.
     * @param {Object} boltAgent the bolt agent for this driver.
     * @param {Object} authToken the object containing auth information.
     * @param {boolean} waitReAuth whether ot not the connection will wait for re-authentication to happen
     * @return {Promise<Connection>} promise resolved with the current connection if connection is successful. Rejected promise otherwise.
     */ ChannelConnection.prototype.connect = function(userAgent, boltAgent, authToken, waitReAuth) {
        return __awaiter(this, void 0, void 0, function() {
            var _this = this;
            return __generator(this, function(_a) {
                switch(_a.label){
                    case 0:
                        if (this._protocol.initialized && !this._protocol.supportsReAuth) {
                            throw (0, neo4j_driver_core_1.newError)('Connection does not support re-auth');
                        }
                        this._authToken = authToken;
                        if (!!this._protocol.initialized) return [
                            3 /*break*/ ,
                            2
                        ];
                        return [
                            4 /*yield*/ ,
                            this._initialize(userAgent, boltAgent, authToken)
                        ];
                    case 1:
                        return [
                            2 /*return*/ ,
                            _a.sent()
                        ];
                    case 2:
                        if (!waitReAuth) return [
                            3 /*break*/ ,
                            4
                        ];
                        return [
                            4 /*yield*/ ,
                            new Promise(function(resolve, reject) {
                                _this._protocol.logoff({
                                    onError: reject
                                });
                                _this._protocol.logon({
                                    authToken: authToken,
                                    onError: reject,
                                    onComplete: function() {
                                        return resolve(_this);
                                    },
                                    flush: true
                                });
                            })
                        ];
                    case 3:
                        return [
                            2 /*return*/ ,
                            _a.sent()
                        ];
                    case 4:
                        this._protocol.logoff();
                        this._protocol.logon({
                            authToken: authToken,
                            flush: true
                        });
                        return [
                            2 /*return*/ ,
                            this
                        ];
                }
            });
        });
    };
    /**
     * Perform protocol-specific initialization which includes authentication.
     * @param {string} userAgent the user agent for this driver.
     * @param {string} boltAgent the bolt agent for this driver.
     * @param {Object} authToken the object containing auth information.
     * @return {Promise<Connection>} promise resolved with the current connection if initialization is successful. Rejected promise otherwise.
     */ ChannelConnection.prototype._initialize = function(userAgent, boltAgent, authToken) {
        var _this = this;
        var self = this;
        return new Promise(function(resolve, reject) {
            _this._protocol.initialize({
                userAgent: userAgent,
                boltAgent: boltAgent,
                authToken: authToken,
                notificationFilter: _this._notificationFilter,
                onError: function(err) {
                    return reject(err);
                },
                onComplete: function(metadata) {
                    var _a;
                    if (metadata) {
                        // read server version from the response metadata, if it is available
                        var serverVersion = metadata.server;
                        if (!_this.version || serverVersion) {
                            _this.version = serverVersion;
                        }
                        // read database connection id from the response metadata, if it is available
                        var dbConnectionId = metadata.connection_id;
                        if (!_this.databaseId) {
                            _this.databaseId = dbConnectionId;
                        }
                        if (metadata.hints) {
                            var receiveTimeoutRaw = metadata.hints['connection.recv_timeout_seconds'];
                            if (receiveTimeoutRaw !== null && receiveTimeoutRaw !== undefined) {
                                var receiveTimeoutInSeconds = (0, neo4j_driver_core_1.toNumber)(receiveTimeoutRaw);
                                if (Number.isInteger(receiveTimeoutInSeconds) && receiveTimeoutInSeconds > 0) {
                                    _this._ch.setupReceiveTimeout(receiveTimeoutInSeconds * 1000);
                                } else {
                                    _this._log.info("Server located at ".concat(_this._address, " supplied an invalid connection receive timeout value (").concat(receiveTimeoutInSeconds, "). ") + 'Please, verify the server configuration and status because this can be the symptom of a bigger issue.');
                                }
                            }
                            var telemetryEnabledHint = metadata.hints['telemetry.enabled'];
                            if (telemetryEnabledHint === true) {
                                _this._telemetryDisabledConnection = false;
                            }
                            _this.SSREnabledHint = metadata.hints['ssr.enabled'];
                        }
                        _this._ssrCallback((_a = _this.SSREnabledHint) !== null && _a !== void 0 ? _a : false, 'OPEN');
                    }
                    resolve(self);
                }
            });
        });
    };
    /**
     * Get the Bolt protocol for the connection.
     * @return {BoltProtocol} the protocol.
     */ ChannelConnection.prototype.protocol = function() {
        return this._protocol;
    };
    Object.defineProperty(ChannelConnection.prototype, "address", {
        get: function() {
            return this._address;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ChannelConnection.prototype, "version", {
        /**
         * Get the version of the connected server.
         * Available only after initialization
         *
         * @returns {ServerVersion} version
         */ get: function() {
            return this._server.version;
        },
        set: function(value) {
            this._server.version = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ChannelConnection.prototype, "server", {
        get: function() {
            return this._server;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ChannelConnection.prototype, "logger", {
        get: function() {
            return this._log;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * "Fatal" means the connection is dead. Only call this if something
     * happens that cannot be recovered from. This will lead to all subscribers
     * failing, and the connection getting ejected from the session pool.
     *
     * @param error an error object, forwarded to all current and future subscribers
     */ ChannelConnection.prototype._handleFatalError = function(error) {
        this._isBroken = true;
        this._error = this.handleAndTransformError(this._protocol.currentFailure || error, this._address);
        if (this._log.isErrorEnabled()) {
            this._log.error("experienced a fatal error caused by ".concat(this._error, " (").concat(neo4j_driver_core_1.json.stringify(this._error), ")"));
        }
        this._protocol.notifyFatalError(this._error);
    };
    /**
     * This method is used by the {@link PooledConnectionProvider}
     *
     * @param {any} observer
     */ ChannelConnection.prototype._setIdle = function(observer) {
        this._idle = true;
        this._ch.stopReceiveTimeout();
        this._protocol.queueObserverIfProtocolIsNotBroken(observer);
    };
    /**
     * This method is used by the {@link PooledConnectionProvider}
     */ ChannelConnection.prototype._unsetIdle = function() {
        this._idle = false;
        this._updateCurrentObserver();
    };
    /**
     * This method still here because of the connection-channel.tests.js
     *
     * @param {any} observer
     */ ChannelConnection.prototype._queueObserver = function(observer) {
        return this._protocol.queueObserverIfProtocolIsNotBroken(observer);
    };
    ChannelConnection.prototype.hasOngoingObservableRequests = function() {
        return !this._idle && this._protocol.hasOngoingObservableRequests();
    };
    /**
     * Send a RESET-message to the database. Message is immediately flushed to the network.
     * @return {Promise<void>} promise resolved when SUCCESS-message response arrives, or failed when other response messages arrives.
     */ ChannelConnection.prototype.resetAndFlush = function() {
        var _this = this;
        return new Promise(function(resolve, reject) {
            _this._reset({
                onError: function(error) {
                    if (_this._isBroken) {
                        // handling a fatal error, no need to raise a protocol violation
                        reject(error);
                    } else {
                        var neo4jError = _this._handleProtocolError("Received FAILURE as a response for RESET: ".concat(error));
                        reject(neo4jError);
                    }
                },
                onComplete: function() {
                    resolve();
                }
            });
        });
    };
    ChannelConnection.prototype._resetOnFailure = function() {
        var _this = this;
        if (!this.isOpen()) {
            return;
        }
        this._reset({
            onError: function() {
                _this._protocol.resetFailure();
            },
            onComplete: function() {
                _this._protocol.resetFailure();
            }
        });
    };
    ChannelConnection.prototype._reset = function(observer) {
        var _this = this;
        if (this._reseting) {
            if (!this._protocol.isLastMessageReset()) {
                this._protocol.reset({
                    onError: function(error) {
                        observer.onError(error);
                    },
                    onComplete: function() {
                        observer.onComplete();
                    }
                });
            } else {
                this._resetObservers.push(observer);
            }
            return;
        }
        this._resetObservers.push(observer);
        this._reseting = true;
        var notifyFinish = function(notify) {
            _this._reseting = false;
            var observers = _this._resetObservers;
            _this._resetObservers = [];
            observers.forEach(notify);
        };
        this._protocol.reset({
            onError: function(error) {
                notifyFinish(function(obs) {
                    return obs.onError(error);
                });
            },
            onComplete: function() {
                notifyFinish(function(obs) {
                    return obs.onComplete();
                });
            }
        });
    };
    /*
     * Pop next pending observer form the list of observers and make it current observer.
     * @protected
     */ ChannelConnection.prototype._updateCurrentObserver = function() {
        this._protocol.updateCurrentObserver();
    };
    /** Check if this connection is in working condition */ ChannelConnection.prototype.isOpen = function() {
        return !this._isBroken && this._ch._open;
    };
    /**
     * Starts and stops the receive timeout timer.
     * @param {number} requestsNumber Ongoing requests number
     */ ChannelConnection.prototype._handleOngoingRequestsNumberChange = function(requestsNumber) {
        if (this._idle) {
            return;
        }
        if (requestsNumber === 0) {
            this._ch.stopReceiveTimeout();
        } else {
            this._ch.startReceiveTimeout();
        }
    };
    /**
     * Call close on the channel.
     * @returns {Promise<void>} - A promise that will be resolved when the underlying channel is closed.
     */ ChannelConnection.prototype.close = function() {
        return __awaiter(this, void 0, void 0, function() {
            var _a;
            return __generator(this, function(_b) {
                switch(_b.label){
                    case 0:
                        this._ssrCallback((_a = this.SSREnabledHint) !== null && _a !== void 0 ? _a : false, 'CLOSE');
                        if (this._log.isDebugEnabled()) {
                            this._log.debug('closing');
                        }
                        if (this._protocol && this.isOpen()) {
                            // protocol has been initialized and this connection is healthy
                            // notify the database about the upcoming close of the connection
                            this._protocol.prepareToClose();
                        }
                        return [
                            4 /*yield*/ ,
                            this._ch.close()
                        ];
                    case 1:
                        _b.sent();
                        if (this._log.isDebugEnabled()) {
                            this._log.debug('closed');
                        }
                        return [
                            2 /*return*/ 
                        ];
                }
            });
        });
    };
    ChannelConnection.prototype.toString = function() {
        return "Connection [".concat(this.id, "][").concat(this.databaseId || '', "]");
    };
    ChannelConnection.prototype._handleProtocolError = function(message) {
        this._protocol.resetFailure();
        this._updateCurrentObserver();
        var error = (0, neo4j_driver_core_1.newError)(message, PROTOCOL_ERROR);
        this._handleFatalError(error);
        return error;
    };
    return ChannelConnection;
}(connection_1.default);
exports.default = ChannelConnection;
/**
 * Creates a log with the connection info as prefix
 * @param {Connection} connection The connection
 * @param {Logger} logger The logger
 * @returns {Logger} The new logger with enriched messages
 */ function createConnectionLogger(connection, logger) {
    return new Logger(logger._level, function(level, message) {
        return logger._loggerFunction(level, "".concat(connection, " ").concat(message));
    });
}
}),
"[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/connection/connection-delegate.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
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
var __importDefault = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : {
        "default": mod
    };
};
Object.defineProperty(exports, "__esModule", {
    value: true
});
var connection_1 = __importDefault(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/connection/connection.js [app-route] (ecmascript)"));
var DelegateConnection = function(_super) {
    __extends(DelegateConnection, _super);
    /**
     * @param delegate {Connection} the delegated connection
     * @param errorHandler {ConnectionErrorHandler} the error handler
     */ function DelegateConnection(delegate, errorHandler) {
        var _this = _super.call(this, errorHandler) || this;
        if (errorHandler) {
            _this._originalErrorHandler = delegate._errorHandler;
            delegate._errorHandler = _this._errorHandler;
        }
        _this._delegate = delegate;
        return _this;
    }
    DelegateConnection.prototype.beginTransaction = function(config) {
        return this._delegate.beginTransaction(config);
    };
    DelegateConnection.prototype.run = function(query, param, config) {
        return this._delegate.run(query, param, config);
    };
    DelegateConnection.prototype.commitTransaction = function(config) {
        return this._delegate.commitTransaction(config);
    };
    DelegateConnection.prototype.rollbackTransaction = function(config) {
        return this._delegate.rollbackTransaction(config);
    };
    DelegateConnection.prototype.getProtocolVersion = function() {
        return this._delegate.getProtocolVersion();
    };
    Object.defineProperty(DelegateConnection.prototype, "id", {
        get: function() {
            return this._delegate.id;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DelegateConnection.prototype, "databaseId", {
        get: function() {
            return this._delegate.databaseId;
        },
        set: function(value) {
            this._delegate.databaseId = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DelegateConnection.prototype, "server", {
        get: function() {
            return this._delegate.server;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DelegateConnection.prototype, "authToken", {
        get: function() {
            return this._delegate.authToken;
        },
        set: function(value) {
            this._delegate.authToken = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DelegateConnection.prototype, "supportsReAuth", {
        get: function() {
            return this._delegate.supportsReAuth;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DelegateConnection.prototype, "address", {
        get: function() {
            return this._delegate.address;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DelegateConnection.prototype, "version", {
        get: function() {
            return this._delegate.version;
        },
        set: function(value) {
            this._delegate.version = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DelegateConnection.prototype, "creationTimestamp", {
        get: function() {
            return this._delegate.creationTimestamp;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DelegateConnection.prototype, "idleTimestamp", {
        get: function() {
            return this._delegate.idleTimestamp;
        },
        set: function(value) {
            this._delegate.idleTimestamp = value;
        },
        enumerable: false,
        configurable: true
    });
    DelegateConnection.prototype.isOpen = function() {
        return this._delegate.isOpen();
    };
    DelegateConnection.prototype.protocol = function() {
        return this._delegate.protocol();
    };
    DelegateConnection.prototype.connect = function(userAgent, boltAgent, authToken, waitReAuth) {
        return this._delegate.connect(userAgent, boltAgent, authToken, waitReAuth);
    };
    DelegateConnection.prototype.write = function(message, observer, flush) {
        return this._delegate.write(message, observer, flush);
    };
    DelegateConnection.prototype.resetAndFlush = function() {
        return this._delegate.resetAndFlush();
    };
    DelegateConnection.prototype.hasOngoingObservableRequests = function() {
        return this._delegate.hasOngoingObservableRequests();
    };
    DelegateConnection.prototype.close = function() {
        return this._delegate.close();
    };
    DelegateConnection.prototype.release = function() {
        if (this._originalErrorHandler) {
            this._delegate._errorHandler = this._originalErrorHandler;
        }
        return this._delegate.release();
    };
    return DelegateConnection;
}(connection_1.default);
exports.default = DelegateConnection;
}),
"[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/connection/connection-error-handler.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
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
var neo4j_driver_core_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/index.js [app-route] (ecmascript)");
var SERVICE_UNAVAILABLE = neo4j_driver_core_1.error.SERVICE_UNAVAILABLE, SESSION_EXPIRED = neo4j_driver_core_1.error.SESSION_EXPIRED;
var ConnectionErrorHandler = function() {
    function ConnectionErrorHandler(errorCode, handleUnavailability, handleWriteFailure, handleSecurityError) {
        this._errorCode = errorCode;
        this._handleUnavailability = handleUnavailability || noOpHandler;
        this._handleWriteFailure = handleWriteFailure || noOpHandler;
        this._handleSecurityError = handleSecurityError || noOpHandler;
    }
    ConnectionErrorHandler.create = function(_a) {
        var errorCode = _a.errorCode, handleUnavailability = _a.handleUnavailability, handleWriteFailure = _a.handleWriteFailure, handleSecurityError = _a.handleSecurityError;
        return new ConnectionErrorHandler(errorCode, handleUnavailability, handleWriteFailure, handleSecurityError);
    };
    /**
     * Error code to use for network errors.
     * @return {string} the error code.
     */ ConnectionErrorHandler.prototype.errorCode = function() {
        return this._errorCode;
    };
    /**
     * Handle and transform the error.
     * @param {Neo4jError} error the original error.
     * @param {ServerAddress} address the address of the connection where the error happened.
     * @return {Neo4jError} new error that should be propagated to the user.
     */ ConnectionErrorHandler.prototype.handleAndTransformError = function(error, address, connection) {
        if (isSecurityError(error)) {
            return this._handleSecurityError(error, address, connection);
        }
        if (isAvailabilityError(error)) {
            return this._handleUnavailability(error, address, connection);
        }
        if (isFailureToWrite(error)) {
            return this._handleWriteFailure(error, address, connection);
        }
        return error;
    };
    return ConnectionErrorHandler;
}();
exports.default = ConnectionErrorHandler;
function isSecurityError(error) {
    return error != null && error.code != null && error.code.startsWith('Neo.ClientError.Security.');
}
function isAvailabilityError(error) {
    if (error) {
        return error.code === SESSION_EXPIRED || error.code === SERVICE_UNAVAILABLE || error.code === 'Neo.TransientError.General.DatabaseUnavailable';
    }
    return false;
}
function isFailureToWrite(error) {
    if (error) {
        return error.code === 'Neo.ClientError.Cluster.NotALeader' || error.code === 'Neo.ClientError.General.ForbiddenOnReadOnlyDatabase';
    }
    return false;
}
function noOpHandler(error) {
    return error;
}
}),
"[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/connection/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
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
exports.createChannelConnection = exports.ConnectionErrorHandler = exports.DelegateConnection = exports.ChannelConnection = exports.Connection = void 0;
var connection_1 = __importDefault(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/connection/connection.js [app-route] (ecmascript)"));
exports.Connection = connection_1.default;
var connection_channel_1 = __importStar(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/connection/connection-channel.js [app-route] (ecmascript)"));
exports.ChannelConnection = connection_channel_1.default;
Object.defineProperty(exports, "createChannelConnection", {
    enumerable: true,
    get: function() {
        return connection_channel_1.createChannelConnection;
    }
});
var connection_delegate_1 = __importDefault(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/connection/connection-delegate.js [app-route] (ecmascript)"));
exports.DelegateConnection = connection_delegate_1.default;
var connection_error_handler_1 = __importDefault(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/connection/connection-error-handler.js [app-route] (ecmascript)"));
exports.ConnectionErrorHandler = connection_error_handler_1.default;
exports.default = connection_1.default;
}),
"[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/connection-provider/authentication-provider.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
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
var neo4j_driver_core_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/index.js [app-route] (ecmascript)");
var lang_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/lang/index.js [app-route] (ecmascript)");
/**
 * Class which provides Authorization for {@link Connection}
 */ var AuthenticationProvider = function() {
    function AuthenticationProvider(_a) {
        var authTokenManager = _a.authTokenManager, userAgent = _a.userAgent, boltAgent = _a.boltAgent;
        this._authTokenManager = authTokenManager || (0, neo4j_driver_core_1.staticAuthTokenManager)({});
        this._userAgent = userAgent;
        this._boltAgent = boltAgent;
    }
    AuthenticationProvider.prototype.authenticate = function(_a) {
        return __awaiter(this, arguments, void 0, function(_b) {
            var shouldReAuth, authToken;
            var connection = _b.connection, auth = _b.auth, skipReAuth = _b.skipReAuth, waitReAuth = _b.waitReAuth, forceReAuth = _b.forceReAuth;
            return __generator(this, function(_c) {
                switch(_c.label){
                    case 0:
                        if (!(auth != null)) return [
                            3 /*break*/ ,
                            3
                        ];
                        shouldReAuth = connection.supportsReAuth === true && (!lang_1.object.equals(connection.authToken, auth) && skipReAuth !== true || forceReAuth === true);
                        if (!(connection.authToken == null || shouldReAuth)) return [
                            3 /*break*/ ,
                            2
                        ];
                        return [
                            4 /*yield*/ ,
                            connection.connect(this._userAgent, this._boltAgent, auth, waitReAuth || false)
                        ];
                    case 1:
                        return [
                            2 /*return*/ ,
                            _c.sent()
                        ];
                    case 2:
                        return [
                            2 /*return*/ ,
                            connection
                        ];
                    case 3:
                        return [
                            4 /*yield*/ ,
                            this._authTokenManager.getToken()
                        ];
                    case 4:
                        authToken = _c.sent();
                        if (!!lang_1.object.equals(authToken, connection.authToken)) return [
                            3 /*break*/ ,
                            6
                        ];
                        return [
                            4 /*yield*/ ,
                            connection.connect(this._userAgent, this._boltAgent, authToken, false)
                        ];
                    case 5:
                        return [
                            2 /*return*/ ,
                            _c.sent()
                        ];
                    case 6:
                        return [
                            2 /*return*/ ,
                            connection
                        ];
                }
            });
        });
    };
    AuthenticationProvider.prototype.handleError = function(_a) {
        var connection = _a.connection, code = _a.code;
        if (connection && code.startsWith('Neo.ClientError.Security.')) {
            return this._authTokenManager.handleSecurityException(connection.authToken, code);
        }
        return false;
    };
    return AuthenticationProvider;
}();
exports.default = AuthenticationProvider;
}),
"[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/connection-provider/liveness-check-provider.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

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
 */ var LivenessCheckProvider = function() {
    function LivenessCheckProvider(_a) {
        var connectionLivenessCheckTimeout = _a.connectionLivenessCheckTimeout;
        this._connectionLivenessCheckTimeout = connectionLivenessCheckTimeout;
    }
    /**
     * Checks connection liveness with configured params.
     *
     * @param {Connection} connection
     * @returns {Promise<true>} If liveness checks succeed, throws otherwise
     */ LivenessCheckProvider.prototype.check = function(connection) {
        return __awaiter(this, void 0, void 0, function() {
            var idleFor;
            return __generator(this, function(_a) {
                switch(_a.label){
                    case 0:
                        if (this._isCheckDisabled || this._isNewlyCreatedConnection(connection)) {
                            return [
                                2 /*return*/ ,
                                true
                            ];
                        }
                        idleFor = Date.now() - connection.idleTimestamp;
                        if (!(this._connectionLivenessCheckTimeout === 0 || idleFor > this._connectionLivenessCheckTimeout)) return [
                            3 /*break*/ ,
                            2
                        ];
                        return [
                            4 /*yield*/ ,
                            connection.resetAndFlush().then(function() {
                                return true;
                            })
                        ];
                    case 1:
                        return [
                            2 /*return*/ ,
                            _a.sent()
                        ];
                    case 2:
                        return [
                            2 /*return*/ ,
                            true
                        ];
                }
            });
        });
    };
    Object.defineProperty(LivenessCheckProvider.prototype, "_isCheckDisabled", {
        get: function() {
            return this._connectionLivenessCheckTimeout == null || this._connectionLivenessCheckTimeout < 0;
        },
        enumerable: false,
        configurable: true
    });
    LivenessCheckProvider.prototype._isNewlyCreatedConnection = function(connection) {
        return connection.authToken == null;
    };
    return LivenessCheckProvider;
}();
exports.default = LivenessCheckProvider;
}),
"[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/connection-provider/client-certificate-holder.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

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
 */ var channel_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/channel/index.js [app-route] (ecmascript)");
var ClientCertificateHolder = function() {
    function ClientCertificateHolder(_a) {
        var clientCertificateProvider = _a.clientCertificateProvider, loader = _a.loader;
        this._clientCertificateProvider = clientCertificateProvider;
        this._loader = loader || channel_1.ClientCertificatesLoader;
        this._clientCertificate = null;
    }
    ClientCertificateHolder.prototype.getClientCertificate = function() {
        return __awaiter(this, void 0, void 0, function() {
            var _a, _b;
            var _this = this;
            return __generator(this, function(_c) {
                switch(_c.label){
                    case 0:
                        _a = this._clientCertificateProvider != null;
                        if (!_a) return [
                            3 /*break*/ ,
                            3
                        ];
                        _b = this._clientCertificate == null;
                        if (_b) return [
                            3 /*break*/ ,
                            2
                        ];
                        return [
                            4 /*yield*/ ,
                            this._clientCertificateProvider.hasUpdate()
                        ];
                    case 1:
                        _b = _c.sent();
                        _c.label = 2;
                    case 2:
                        _a = _b;
                        _c.label = 3;
                    case 3:
                        if (_a) {
                            this._clientCertificate = Promise.resolve(this._clientCertificateProvider.getClientCertificate()).then(this._loader.load).then(function(clientCertificate) {
                                _this._clientCertificate = clientCertificate;
                                return _this._clientCertificate;
                            }).catch(function(error) {
                                _this._clientCertificate = null;
                                throw error;
                            });
                        }
                        return [
                            2 /*return*/ ,
                            this._clientCertificate
                        ];
                }
            });
        });
    };
    return ClientCertificateHolder;
}();
exports.default = ClientCertificateHolder;
}),
"[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/connection-provider/connection-provider-pooled.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
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
var connection_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/connection/index.js [app-route] (ecmascript)");
var neo4j_driver_core_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/index.js [app-route] (ecmascript)");
var authentication_provider_1 = __importDefault(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/connection-provider/authentication-provider.js [app-route] (ecmascript)"));
var lang_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/lang/index.js [app-route] (ecmascript)");
var liveness_check_provider_1 = __importDefault(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/connection-provider/liveness-check-provider.js [app-route] (ecmascript)"));
var client_certificate_holder_1 = __importDefault(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/connection-provider/client-certificate-holder.js [app-route] (ecmascript)"));
var SERVICE_UNAVAILABLE = neo4j_driver_core_1.error.SERVICE_UNAVAILABLE;
var AUTHENTICATION_ERRORS = [
    'Neo.ClientError.Security.CredentialsExpired',
    'Neo.ClientError.Security.Forbidden',
    'Neo.ClientError.Security.TokenExpired',
    'Neo.ClientError.Security.Unauthorized'
];
var _a = neo4j_driver_core_1.internal.pool, Pool = _a.Pool, PoolConfig = _a.PoolConfig;
var PooledConnectionProvider = function(_super) {
    __extends(PooledConnectionProvider, _super);
    function PooledConnectionProvider(_a, createChannelConnectionHook) {
        var id = _a.id, config = _a.config, log = _a.log, userAgent = _a.userAgent, boltAgent = _a.boltAgent, authTokenManager = _a.authTokenManager, _b = _a.newPool, newPool = _b === void 0 ? function() {
            var args = [];
            for(var _i = 0; _i < arguments.length; _i++){
                args[_i] = arguments[_i];
            }
            return new (Pool.bind.apply(Pool, __spreadArray([
                void 0
            ], __read(args), false)))();
        } : _b;
        if (createChannelConnectionHook === void 0) {
            createChannelConnectionHook = null;
        }
        var _this = _super.call(this) || this;
        _this._id = id;
        _this._config = config;
        _this._log = log;
        _this._clientCertificateHolder = new client_certificate_holder_1.default({
            clientCertificateProvider: _this._config.clientCertificate
        });
        _this._authenticationProvider = new authentication_provider_1.default({
            authTokenManager: authTokenManager,
            userAgent: userAgent,
            boltAgent: boltAgent
        });
        _this._livenessCheckProvider = new liveness_check_provider_1.default({
            connectionLivenessCheckTimeout: config.connectionLivenessCheckTimeout
        });
        _this._userAgent = userAgent;
        _this._boltAgent = boltAgent;
        _this._createChannelConnection = createChannelConnectionHook || function(address) {
            return __awaiter(_this, void 0, void 0, function() {
                var _a, _b;
                return __generator(this, function(_c) {
                    switch(_c.label){
                        case 0:
                            _a = connection_1.createChannelConnection;
                            _b = [
                                address,
                                this._config,
                                this._createConnectionErrorHandler(),
                                this._log
                            ];
                            return [
                                4 /*yield*/ ,
                                this._clientCertificateHolder.getClientCertificate()
                            ];
                        case 1:
                            return [
                                2 /*return*/ ,
                                _a.apply(void 0, _b.concat([
                                    _c.sent()
                                ]))
                            ];
                    }
                });
            });
        };
        _this._connectionPool = newPool({
            create: _this._createConnection.bind(_this),
            destroy: _this._destroyConnection.bind(_this),
            validateOnAcquire: _this._validateConnectionOnAcquire.bind(_this),
            validateOnRelease: _this._validateConnectionOnRelease.bind(_this),
            installIdleObserver: PooledConnectionProvider._installIdleObserverOnConnection.bind(_this),
            removeIdleObserver: PooledConnectionProvider._removeIdleObserverOnConnection.bind(_this),
            config: PoolConfig.fromDriverConfig(config),
            log: _this._log
        });
        _this._openConnections = {};
        return _this;
    }
    PooledConnectionProvider.prototype._createConnectionErrorHandler = function() {
        return new connection_1.ConnectionErrorHandler(SERVICE_UNAVAILABLE);
    };
    PooledConnectionProvider.prototype._getClientCertificate = function() {
        return __awaiter(this, void 0, void 0, function() {
            return __generator(this, function(_a) {
                return [
                    2 /*return*/ ,
                    this._config.clientCertificate.getClientCertificate()
                ];
            });
        });
    };
    /**
     * Create a new connection and initialize it.
     * @return {Promise<Connection>} promise resolved with a new connection or rejected when failed to connect.
     * @access private
     */ PooledConnectionProvider.prototype._createConnection = function(_a, address, release) {
        var _this = this;
        var auth = _a.auth;
        return this._createChannelConnection(address).then(function(connection) {
            connection.release = function() {
                connection.idleTimestamp = Date.now();
                return release(address, connection);
            };
            _this._openConnections[connection.id] = connection;
            return _this._authenticationProvider.authenticate({
                connection: connection,
                auth: auth
            }).catch(function(error) {
                // let's destroy this connection
                _this._destroyConnection(connection);
                // propagate the error because connection failed to connect / initialize
                throw error;
            });
        });
    };
    PooledConnectionProvider.prototype._validateConnectionOnAcquire = function(_a, conn_1) {
        return __awaiter(this, arguments, void 0, function(_b, conn) {
            var error_1, error_2;
            var auth = _b.auth, skipReAuth = _b.skipReAuth;
            return __generator(this, function(_c) {
                switch(_c.label){
                    case 0:
                        if (!this._validateConnection(conn)) {
                            return [
                                2 /*return*/ ,
                                false
                            ];
                        }
                        _c.label = 1;
                    case 1:
                        _c.trys.push([
                            1,
                            3,
                            ,
                            4
                        ]);
                        return [
                            4 /*yield*/ ,
                            this._livenessCheckProvider.check(conn)
                        ];
                    case 2:
                        _c.sent();
                        return [
                            3 /*break*/ ,
                            4
                        ];
                    case 3:
                        error_1 = _c.sent();
                        this._log.debug("The connection ".concat(conn.id, " is not alive because of an error ").concat(error_1.code, " '").concat(error_1.message, "'"));
                        return [
                            2 /*return*/ ,
                            false
                        ];
                    case 4:
                        _c.trys.push([
                            4,
                            6,
                            ,
                            7
                        ]);
                        return [
                            4 /*yield*/ ,
                            this._authenticationProvider.authenticate({
                                connection: conn,
                                auth: auth,
                                skipReAuth: skipReAuth
                            })
                        ];
                    case 5:
                        _c.sent();
                        return [
                            2 /*return*/ ,
                            true
                        ];
                    case 6:
                        error_2 = _c.sent();
                        this._log.debug("The connection ".concat(conn.id, " is not valid because of an error ").concat(error_2.code, " '").concat(error_2.message, "'"));
                        return [
                            2 /*return*/ ,
                            false
                        ];
                    case 7:
                        return [
                            2 /*return*/ 
                        ];
                }
            });
        });
    };
    PooledConnectionProvider.prototype._validateConnectionOnRelease = function(conn) {
        return conn._sticky !== true && this._validateConnection(conn);
    };
    /**
     * Check that a connection is usable
     * @return {boolean} true if the connection is open
     * @access private
     **/ PooledConnectionProvider.prototype._validateConnection = function(conn) {
        if (!conn.isOpen()) {
            return false;
        }
        var maxConnectionLifetime = this._config.maxConnectionLifetime;
        var lifetime = Date.now() - conn.creationTimestamp;
        if (lifetime > maxConnectionLifetime) {
            return false;
        }
        return true;
    };
    /**
     * Dispose of a connection.
     * @return {Connection} the connection to dispose.
     * @access private
     */ PooledConnectionProvider.prototype._destroyConnection = function(conn) {
        delete this._openConnections[conn.id];
        return conn.close();
    };
    /**
     * Acquire a connection from the pool and return it ServerInfo
     * @param {object} param
     * @param {string} param.address the server address
     * @return {Promise<ServerInfo>} the server info
     */ PooledConnectionProvider.prototype._verifyConnectivityAndGetServerVersion = function(_a) {
        return __awaiter(this, arguments, void 0, function(_b) {
            var connection, serverInfo;
            var address = _b.address;
            return __generator(this, function(_c) {
                switch(_c.label){
                    case 0:
                        return [
                            4 /*yield*/ ,
                            this._connectionPool.acquire({}, address)
                        ];
                    case 1:
                        connection = _c.sent();
                        serverInfo = new neo4j_driver_core_1.ServerInfo(connection.server, connection.protocol().version);
                        _c.label = 2;
                    case 2:
                        _c.trys.push([
                            2,
                            ,
                            5,
                            7
                        ]);
                        if (!!connection.protocol().isLastMessageLogon()) return [
                            3 /*break*/ ,
                            4
                        ];
                        return [
                            4 /*yield*/ ,
                            connection.resetAndFlush()
                        ];
                    case 3:
                        _c.sent();
                        _c.label = 4;
                    case 4:
                        return [
                            3 /*break*/ ,
                            7
                        ];
                    case 5:
                        return [
                            4 /*yield*/ ,
                            connection.release()
                        ];
                    case 6:
                        _c.sent();
                        return [
                            7 /*endfinally*/ 
                        ];
                    case 7:
                        return [
                            2 /*return*/ ,
                            serverInfo
                        ];
                }
            });
        });
    };
    PooledConnectionProvider.prototype._verifyAuthentication = function(_a) {
        return __awaiter(this, arguments, void 0, function(_b) {
            var connectionsToRelease, address, connection, lastMessageIsNotLogin, stickyConnection, error_3;
            var getAddress = _b.getAddress, auth = _b.auth;
            return __generator(this, function(_c) {
                switch(_c.label){
                    case 0:
                        connectionsToRelease = [];
                        _c.label = 1;
                    case 1:
                        _c.trys.push([
                            1,
                            8,
                            9,
                            11
                        ]);
                        return [
                            4 /*yield*/ ,
                            getAddress()
                        ];
                    case 2:
                        address = _c.sent();
                        return [
                            4 /*yield*/ ,
                            this._connectionPool.acquire({
                                auth: auth,
                                skipReAuth: true
                            }, address)
                        ];
                    case 3:
                        connection = _c.sent();
                        connectionsToRelease.push(connection);
                        lastMessageIsNotLogin = !connection.protocol().isLastMessageLogon();
                        if (!connection.supportsReAuth) {
                            throw (0, neo4j_driver_core_1.newError)('Driver is connected to a database that does not support user switch.');
                        }
                        if (!(lastMessageIsNotLogin && connection.supportsReAuth)) return [
                            3 /*break*/ ,
                            5
                        ];
                        return [
                            4 /*yield*/ ,
                            this._authenticationProvider.authenticate({
                                connection: connection,
                                auth: auth,
                                waitReAuth: true,
                                forceReAuth: true
                            })
                        ];
                    case 4:
                        _c.sent();
                        return [
                            3 /*break*/ ,
                            7
                        ];
                    case 5:
                        if (!(lastMessageIsNotLogin && !connection.supportsReAuth)) return [
                            3 /*break*/ ,
                            7
                        ];
                        return [
                            4 /*yield*/ ,
                            this._connectionPool.acquire({
                                auth: auth
                            }, address, {
                                requireNew: true
                            })
                        ];
                    case 6:
                        stickyConnection = _c.sent();
                        stickyConnection._sticky = true;
                        connectionsToRelease.push(stickyConnection);
                        _c.label = 7;
                    case 7:
                        return [
                            2 /*return*/ ,
                            true
                        ];
                    case 8:
                        error_3 = _c.sent();
                        if (AUTHENTICATION_ERRORS.includes(error_3.code)) {
                            return [
                                2 /*return*/ ,
                                false
                            ];
                        }
                        throw error_3;
                    case 9:
                        return [
                            4 /*yield*/ ,
                            Promise.all(connectionsToRelease.map(function(conn) {
                                return conn.release();
                            }))
                        ];
                    case 10:
                        _c.sent();
                        return [
                            7 /*endfinally*/ 
                        ];
                    case 11:
                        return [
                            2 /*return*/ 
                        ];
                }
            });
        });
    };
    PooledConnectionProvider.prototype._verifyStickyConnection = function(_a) {
        return __awaiter(this, arguments, void 0, function(_b) {
            var connectionWithSameCredentials, shouldCreateStickyConnection;
            var auth = _b.auth, connection = _b.connection, address = _b.address;
            return __generator(this, function(_c) {
                switch(_c.label){
                    case 0:
                        connectionWithSameCredentials = lang_1.object.equals(auth, connection.authToken);
                        shouldCreateStickyConnection = !connectionWithSameCredentials;
                        connection._sticky = connectionWithSameCredentials && !connection.supportsReAuth;
                        if (!(shouldCreateStickyConnection || connection._sticky)) return [
                            3 /*break*/ ,
                            2
                        ];
                        return [
                            4 /*yield*/ ,
                            connection.release()
                        ];
                    case 1:
                        _c.sent();
                        throw (0, neo4j_driver_core_1.newError)('Driver is connected to a database that does not support user switch.');
                    case 2:
                        return [
                            2 /*return*/ 
                        ];
                }
            });
        });
    };
    PooledConnectionProvider.prototype.close = function() {
        return __awaiter(this, void 0, void 0, function() {
            return __generator(this, function(_a) {
                switch(_a.label){
                    case 0:
                        // purge all idle connections in the connection pool
                        return [
                            4 /*yield*/ ,
                            this._connectionPool.close()
                        ];
                    case 1:
                        // purge all idle connections in the connection pool
                        _a.sent();
                        // then close all connections driver has ever created
                        // it is needed to close connections that are active right now and are acquired from the pool
                        return [
                            4 /*yield*/ ,
                            Promise.all(Object.values(this._openConnections).map(function(c) {
                                return c.close();
                            }))
                        ];
                    case 2:
                        // then close all connections driver has ever created
                        // it is needed to close connections that are active right now and are acquired from the pool
                        _a.sent();
                        return [
                            2 /*return*/ 
                        ];
                }
            });
        });
    };
    PooledConnectionProvider._installIdleObserverOnConnection = function(conn, observer) {
        conn._setIdle(observer);
    };
    PooledConnectionProvider._removeIdleObserverOnConnection = function(conn) {
        conn._unsetIdle();
    };
    PooledConnectionProvider.prototype._handleSecurityError = function(error, address, connection) {
        var handled = this._authenticationProvider.handleError({
            connection: connection,
            code: error.code
        });
        if (handled) {
            error.retriable = true; // remove in 7.0
            error.retryable = true;
        }
        if (error.code === 'Neo.ClientError.Security.AuthorizationExpired') {
            this._connectionPool.apply(address, function(conn) {
                conn.authToken = null;
            });
        }
        if (connection) {
            connection.close().catch(function() {
                return undefined;
            });
        }
        return error;
    };
    return PooledConnectionProvider;
}(neo4j_driver_core_1.ConnectionProvider);
exports.default = PooledConnectionProvider;
}),
"[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/connection-provider/connection-provider-direct.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
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
Object.defineProperty(exports, "__esModule", {
    value: true
});
var connection_provider_pooled_1 = __importDefault(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/connection-provider/connection-provider-pooled.js [app-route] (ecmascript)"));
var connection_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/connection/index.js [app-route] (ecmascript)");
var neo4j_driver_core_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/index.js [app-route] (ecmascript)");
var _a = neo4j_driver_core_1.internal.constants, BOLT_PROTOCOL_V3 = _a.BOLT_PROTOCOL_V3, BOLT_PROTOCOL_V4_0 = _a.BOLT_PROTOCOL_V4_0, BOLT_PROTOCOL_V4_4 = _a.BOLT_PROTOCOL_V4_4, BOLT_PROTOCOL_V5_1 = _a.BOLT_PROTOCOL_V5_1;
var SERVICE_UNAVAILABLE = neo4j_driver_core_1.error.SERVICE_UNAVAILABLE;
var DirectConnectionProvider = function(_super) {
    __extends(DirectConnectionProvider, _super);
    function DirectConnectionProvider(_a) {
        var id = _a.id, config = _a.config, log = _a.log, address = _a.address, userAgent = _a.userAgent, boltAgent = _a.boltAgent, authTokenManager = _a.authTokenManager, newPool = _a.newPool;
        var _this = _super.call(this, {
            id: id,
            config: config,
            log: log,
            userAgent: userAgent,
            boltAgent: boltAgent,
            authTokenManager: authTokenManager,
            newPool: newPool
        }) || this;
        _this._address = address;
        return _this;
    }
    /**
     * See {@link ConnectionProvider} for more information about this method and
     * its arguments.
     */ DirectConnectionProvider.prototype.acquireConnection = function() {
        return __awaiter(this, arguments, void 0, function(_a) {
            var databaseSpecificErrorHandler, connection;
            var _this = this;
            var _b = _a === void 0 ? {} : _a, accessMode = _b.accessMode, database = _b.database, bookmarks = _b.bookmarks, auth = _b.auth, forceReAuth = _b.forceReAuth;
            return __generator(this, function(_c) {
                switch(_c.label){
                    case 0:
                        databaseSpecificErrorHandler = connection_1.ConnectionErrorHandler.create({
                            errorCode: SERVICE_UNAVAILABLE,
                            handleSecurityError: function(error, address, conn) {
                                return _this._handleSecurityError(error, address, conn, database);
                            }
                        });
                        return [
                            4 /*yield*/ ,
                            this._connectionPool.acquire({
                                auth: auth,
                                forceReAuth: forceReAuth
                            }, this._address)
                        ];
                    case 1:
                        connection = _c.sent();
                        if (!auth) return [
                            3 /*break*/ ,
                            3
                        ];
                        return [
                            4 /*yield*/ ,
                            this._verifyStickyConnection({
                                auth: auth,
                                connection: connection,
                                address: this._address
                            })
                        ];
                    case 2:
                        _c.sent();
                        return [
                            2 /*return*/ ,
                            connection
                        ];
                    case 3:
                        return [
                            2 /*return*/ ,
                            new connection_1.DelegateConnection(connection, databaseSpecificErrorHandler)
                        ];
                }
            });
        });
    };
    DirectConnectionProvider.prototype._handleSecurityError = function(error, address, connection, database) {
        this._log.warn("Direct driver ".concat(this._id, " will close connection to ").concat(address, " for database '").concat(database, "' because of an error ").concat(error.code, " '").concat(error.message, "'"));
        return _super.prototype._handleSecurityError.call(this, error, address, connection);
    };
    DirectConnectionProvider.prototype._hasProtocolVersion = function(versionPredicate) {
        return __awaiter(this, void 0, void 0, function() {
            var connection, protocolVersion;
            return __generator(this, function(_a) {
                switch(_a.label){
                    case 0:
                        return [
                            4 /*yield*/ ,
                            this._createChannelConnection(this._address)
                        ];
                    case 1:
                        connection = _a.sent();
                        protocolVersion = connection.protocol() ? connection.protocol().version : null;
                        return [
                            4 /*yield*/ ,
                            connection.close()
                        ];
                    case 2:
                        _a.sent();
                        if (protocolVersion) {
                            return [
                                2 /*return*/ ,
                                versionPredicate(protocolVersion)
                            ];
                        }
                        return [
                            2 /*return*/ ,
                            false
                        ];
                }
            });
        });
    };
    DirectConnectionProvider.prototype.supportsMultiDb = function() {
        return __awaiter(this, void 0, void 0, function() {
            return __generator(this, function(_a) {
                switch(_a.label){
                    case 0:
                        return [
                            4 /*yield*/ ,
                            this._hasProtocolVersion(function(version) {
                                return version.isGreaterOrEqualTo(BOLT_PROTOCOL_V4_0);
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
    DirectConnectionProvider.prototype.getNegotiatedProtocolVersion = function() {
        var _this = this;
        return new Promise(function(resolve, reject) {
            _this._hasProtocolVersion(resolve).catch(reject);
        });
    };
    DirectConnectionProvider.prototype.supportsTransactionConfig = function() {
        return __awaiter(this, void 0, void 0, function() {
            return __generator(this, function(_a) {
                switch(_a.label){
                    case 0:
                        return [
                            4 /*yield*/ ,
                            this._hasProtocolVersion(function(version) {
                                return version.isGreaterOrEqualTo(BOLT_PROTOCOL_V3);
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
    DirectConnectionProvider.prototype.supportsUserImpersonation = function() {
        return __awaiter(this, void 0, void 0, function() {
            return __generator(this, function(_a) {
                switch(_a.label){
                    case 0:
                        return [
                            4 /*yield*/ ,
                            this._hasProtocolVersion(function(version) {
                                return version.isGreaterOrEqualTo(BOLT_PROTOCOL_V4_4);
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
    DirectConnectionProvider.prototype.supportsSessionAuth = function() {
        return __awaiter(this, void 0, void 0, function() {
            return __generator(this, function(_a) {
                switch(_a.label){
                    case 0:
                        return [
                            4 /*yield*/ ,
                            this._hasProtocolVersion(function(version) {
                                return version.isGreaterOrEqualTo(BOLT_PROTOCOL_V5_1);
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
    DirectConnectionProvider.prototype.verifyAuthentication = function(_a) {
        return __awaiter(this, arguments, void 0, function(_b) {
            var _this = this;
            var auth = _b.auth;
            return __generator(this, function(_c) {
                return [
                    2 /*return*/ ,
                    this._verifyAuthentication({
                        auth: auth,
                        getAddress: function() {
                            return _this._address;
                        }
                    })
                ];
            });
        });
    };
    DirectConnectionProvider.prototype.verifyConnectivityAndGetServerInfo = function() {
        return __awaiter(this, void 0, void 0, function() {
            return __generator(this, function(_a) {
                switch(_a.label){
                    case 0:
                        return [
                            4 /*yield*/ ,
                            this._verifyConnectivityAndGetServerVersion({
                                address: this._address
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
    return DirectConnectionProvider;
}(connection_provider_pooled_1.default);
exports.default = DirectConnectionProvider;
}),
"[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/rediscovery/routing-table.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

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
exports.createValidRoutingTable = createValidRoutingTable;
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
 */ var neo4j_driver_core_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/index.js [app-route] (ecmascript)");
var _a = neo4j_driver_core_1.internal.constants, WRITE = _a.ACCESS_MODE_WRITE, READ = _a.ACCESS_MODE_READ, ServerAddress = neo4j_driver_core_1.internal.serverAddress.ServerAddress;
var PROTOCOL_ERROR = neo4j_driver_core_1.error.PROTOCOL_ERROR;
var MIN_ROUTERS = 1;
/**
 * The routing table object used to determine the role of the servers in the driver.
 */ var RoutingTable = function() {
    function RoutingTable(_a) {
        var _b = _a === void 0 ? {} : _a, database = _b.database, routers = _b.routers, readers = _b.readers, writers = _b.writers, expirationTime = _b.expirationTime, ttl = _b.ttl;
        this.database = database || null;
        this.databaseName = database || 'default database';
        this.routers = routers || [];
        this.readers = readers || [];
        this.writers = writers || [];
        this.expirationTime = expirationTime || (0, neo4j_driver_core_1.int)(0);
        this.ttl = ttl;
    }
    /**
     * Create a valid routing table from a raw object
     *
     * @param {string} database the database name. It is used for logging purposes
     * @param {ServerAddress} routerAddress The router address, it is used for loggin purposes
     * @param {RawRoutingTable} rawRoutingTable Method used to get the raw routing table to be processed
     * @param {RoutingTable} The valid Routing Table
     */ RoutingTable.fromRawRoutingTable = function(database, routerAddress, rawRoutingTable) {
        return createValidRoutingTable(database, routerAddress, rawRoutingTable);
    };
    RoutingTable.prototype.forget = function(address) {
        // Don't remove it from the set of routers, since that might mean we lose our ability to re-discover,
        // just remove it from the set of readers and writers, so that we don't use it for actual work without
        // performing discovery first.
        this.readers = removeFromArray(this.readers, address);
        this.writers = removeFromArray(this.writers, address);
    };
    RoutingTable.prototype.forgetRouter = function(address) {
        this.routers = removeFromArray(this.routers, address);
    };
    RoutingTable.prototype.forgetWriter = function(address) {
        this.writers = removeFromArray(this.writers, address);
    };
    /**
     * Check if this routing table is fresh to perform the required operation.
     * @param {string} accessMode the type of operation. Allowed values are {@link READ} and {@link WRITE}.
     * @return {boolean} `true` when this table contains servers to serve the required operation, `false` otherwise.
     */ RoutingTable.prototype.isStaleFor = function(accessMode) {
        return this.expirationTime.lessThan(Date.now()) || this.routers.length < MIN_ROUTERS || accessMode === READ && this.readers.length === 0 || accessMode === WRITE && this.writers.length === 0;
    };
    /**
     * Check if this routing table is expired for specified amount of duration
     *
     * @param {Integer} duration amount of duration in milliseconds to check for expiration
     * @returns {boolean}
     */ RoutingTable.prototype.isExpiredFor = function(duration) {
        return this.expirationTime.add(duration).lessThan(Date.now());
    };
    RoutingTable.prototype.allServers = function() {
        return __spreadArray(__spreadArray(__spreadArray([], __read(this.routers), false), __read(this.readers), false), __read(this.writers), false);
    };
    RoutingTable.prototype.toString = function() {
        return 'RoutingTable[' + "database=".concat(this.databaseName, ", ") + "expirationTime=".concat(this.expirationTime, ", ") + "currentTime=".concat(Date.now(), ", ") + "routers=[".concat(this.routers, "], ") + "readers=[".concat(this.readers, "], ") + "writers=[".concat(this.writers, "]]");
    };
    return RoutingTable;
}();
exports.default = RoutingTable;
/**
 * Remove all occurrences of the element in the array.
 * @param {Array} array the array to filter.
 * @param {Object} element the element to remove.
 * @return {Array} new filtered array.
 */ function removeFromArray(array, element) {
    return array.filter(function(item) {
        return item.asKey() !== element.asKey();
    });
}
/**
 * Create a valid routing table from a raw object
 *
 * @param {string} db the database name. It is used for logging purposes
 * @param {ServerAddress} routerAddress The router address, it is used for loggin purposes
 * @param {RawRoutingTable} rawRoutingTable Method used to get the raw routing table to be processed
 * @param {RoutingTable} The valid Routing Table
 */ function createValidRoutingTable(database, routerAddress, rawRoutingTable) {
    var ttl = rawRoutingTable.ttl;
    var expirationTime = calculateExpirationTime(rawRoutingTable, routerAddress);
    var _a = parseServers(rawRoutingTable, routerAddress), routers = _a.routers, readers = _a.readers, writers = _a.writers;
    assertNonEmpty(routers, 'routers', routerAddress);
    assertNonEmpty(readers, 'readers', routerAddress);
    return new RoutingTable({
        database: database || rawRoutingTable.db,
        routers: routers,
        readers: readers,
        writers: writers,
        expirationTime: expirationTime,
        ttl: ttl
    });
}
/**
 * Parse server from the RawRoutingTable.
 *
 * @param {RawRoutingTable} rawRoutingTable the raw routing table
 * @param {string} routerAddress the router address
 * @returns {Object} The object with the list of routers, readers and writers
 */ function parseServers(rawRoutingTable, routerAddress) {
    try {
        var routers_1 = [];
        var readers_1 = [];
        var writers_1 = [];
        rawRoutingTable.servers.forEach(function(server) {
            var role = server.role;
            var addresses = server.addresses;
            if (role === 'ROUTE') {
                routers_1 = parseArray(addresses).map(function(address) {
                    return ServerAddress.fromUrl(address);
                });
            } else if (role === 'WRITE') {
                writers_1 = parseArray(addresses).map(function(address) {
                    return ServerAddress.fromUrl(address);
                });
            } else if (role === 'READ') {
                readers_1 = parseArray(addresses).map(function(address) {
                    return ServerAddress.fromUrl(address);
                });
            }
        });
        return {
            routers: routers_1,
            readers: readers_1,
            writers: writers_1
        };
    } catch (error) {
        throw (0, neo4j_driver_core_1.newError)("Unable to parse servers entry from router ".concat(routerAddress, " from addresses:\n").concat(neo4j_driver_core_1.json.stringify(rawRoutingTable.servers), "\nError message: ").concat(error.message), PROTOCOL_ERROR);
    }
}
/**
 * Call the expiration time using the ttls from the raw routing table and return it
 *
 * @param {RawRoutingTable} rawRoutingTable the routing table
 * @param {string} routerAddress the router address
 * @returns {number} the ttl
 */ function calculateExpirationTime(rawRoutingTable, routerAddress) {
    try {
        var now = (0, neo4j_driver_core_1.int)(Date.now());
        var expires = (0, neo4j_driver_core_1.int)(rawRoutingTable.ttl).multiply(1000).add(now);
        // if the server uses a really big expire time like Long.MAX_VALUE this may have overflowed
        if (expires.lessThan(now)) {
            return neo4j_driver_core_1.Integer.MAX_VALUE;
        }
        return expires;
    } catch (error) {
        throw (0, neo4j_driver_core_1.newError)("Unable to parse TTL entry from router ".concat(routerAddress, " from raw routing table:\n").concat(neo4j_driver_core_1.json.stringify(rawRoutingTable), "\nError message: ").concat(error.message), PROTOCOL_ERROR);
    }
}
/**
 * Assert if serverAddressesArray is not empty, throws and PROTOCOL_ERROR otherwise
 *
 * @param {string[]} serverAddressesArray array of addresses
 * @param {string} serversName the server name
 * @param {string} routerAddress the router address
 */ function assertNonEmpty(serverAddressesArray, serversName, routerAddress) {
    if (serverAddressesArray.length === 0) {
        throw (0, neo4j_driver_core_1.newError)('Received no ' + serversName + ' from router ' + routerAddress, PROTOCOL_ERROR);
    }
}
function parseArray(addresses) {
    if (!Array.isArray(addresses)) {
        throw new TypeError('Array expected but got: ' + addresses);
    }
    return Array.from(addresses);
}
}),
"[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/rediscovery/rediscovery.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __importDefault = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : {
        "default": mod
    };
};
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
 */ var routing_table_1 = __importDefault(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/rediscovery/routing-table.js [app-route] (ecmascript)"));
// eslint-disable-next-line no-unused-vars
var neo4j_driver_core_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/index.js [app-route] (ecmascript)");
var Rediscovery = function() {
    /**
     * @constructor
     * @param {object} routingContext
     */ function Rediscovery(routingContext) {
        this._routingContext = routingContext;
    }
    /**
     * Try to fetch new routing table from the given router.
     * @param {Session} session the session to use.
     * @param {string} database the database for which to lookup routing table.
     * @param {ServerAddress} routerAddress the URL of the router.
     * @param {string} impersonatedUser The impersonated user
     * @return {Promise<RoutingTable>} promise resolved with new routing table or null when connection error happened.
     */ Rediscovery.prototype.lookupRoutingTableOnRouter = function(session, database, routerAddress, impersonatedUser) {
        var _this = this;
        return session._acquireConnection(function(connection) {
            return _this._requestRawRoutingTable(connection, session, database, routerAddress, impersonatedUser).then(function(rawRoutingTable) {
                if (rawRoutingTable.isNull) {
                    return null;
                }
                return routing_table_1.default.fromRawRoutingTable(database, routerAddress, rawRoutingTable);
            });
        });
    };
    Rediscovery.prototype._requestRawRoutingTable = function(connection, session, database, routerAddress, impersonatedUser) {
        var _this = this;
        return new Promise(function(resolve, reject) {
            connection.protocol().requestRoutingInformation({
                routingContext: _this._routingContext,
                databaseName: database,
                impersonatedUser: impersonatedUser,
                sessionContext: {
                    bookmarks: session._lastBookmarks,
                    mode: session._mode,
                    database: session._database,
                    afterComplete: session._onComplete
                },
                onCompleted: resolve,
                onError: reject
            });
        });
    };
    return Rediscovery;
}();
exports.default = Rediscovery;
}),
"[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/rediscovery/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
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
 */ var __importDefault = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : {
        "default": mod
    };
};
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.RoutingTable = exports.Rediscovery = void 0;
var rediscovery_1 = __importDefault(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/rediscovery/rediscovery.js [app-route] (ecmascript)"));
exports.Rediscovery = rediscovery_1.default;
var routing_table_1 = __importDefault(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/rediscovery/routing-table.js [app-route] (ecmascript)"));
exports.RoutingTable = routing_table_1.default;
exports.default = rediscovery_1.default;
}),
"[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/connection-provider/connection-provider-routing.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
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
var __importDefault = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : {
        "default": mod
    };
};
Object.defineProperty(exports, "__esModule", {
    value: true
});
var neo4j_driver_core_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-core/lib/index.js [app-route] (ecmascript)");
var rediscovery_1 = __importStar(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/rediscovery/index.js [app-route] (ecmascript)"));
var channel_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/channel/index.js [app-route] (ecmascript)");
var connection_provider_single_1 = __importDefault(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/connection-provider/connection-provider-single.js [app-route] (ecmascript)"));
var connection_provider_pooled_1 = __importDefault(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/connection-provider/connection-provider-pooled.js [app-route] (ecmascript)"));
var load_balancing_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/load-balancing/index.js [app-route] (ecmascript)");
var connection_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/connection/index.js [app-route] (ecmascript)");
var lang_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/lang/index.js [app-route] (ecmascript)");
var SERVICE_UNAVAILABLE = neo4j_driver_core_1.error.SERVICE_UNAVAILABLE, SESSION_EXPIRED = neo4j_driver_core_1.error.SESSION_EXPIRED;
var Bookmarks = neo4j_driver_core_1.internal.bookmarks.Bookmarks, _a = neo4j_driver_core_1.internal.constants, READ = _a.ACCESS_MODE_READ, WRITE = _a.ACCESS_MODE_WRITE, BOLT_PROTOCOL_V3 = _a.BOLT_PROTOCOL_V3, BOLT_PROTOCOL_V4_0 = _a.BOLT_PROTOCOL_V4_0, BOLT_PROTOCOL_V4_4 = _a.BOLT_PROTOCOL_V4_4, BOLT_PROTOCOL_V5_1 = _a.BOLT_PROTOCOL_V5_1;
var PROCEDURE_NOT_FOUND_CODE = 'Neo.ClientError.Procedure.ProcedureNotFound';
var DATABASE_NOT_FOUND_CODE = 'Neo.ClientError.Database.DatabaseNotFound';
var INVALID_BOOKMARK_CODE = 'Neo.ClientError.Transaction.InvalidBookmark';
var INVALID_BOOKMARK_MIXTURE_CODE = 'Neo.ClientError.Transaction.InvalidBookmarkMixture';
var AUTHORIZATION_EXPIRED_CODE = 'Neo.ClientError.Security.AuthorizationExpired';
var INVALID_ARGUMENT_ERROR = 'Neo.ClientError.Statement.ArgumentError';
var INVALID_REQUEST_ERROR = 'Neo.ClientError.Request.Invalid';
var STATEMENT_TYPE_ERROR = 'Neo.ClientError.Statement.TypeError';
var NOT_AVAILABLE = 'N/A';
var SYSTEM_DB_NAME = 'system';
var DEFAULT_DB_NAME = null;
var DEFAULT_ROUTING_TABLE_PURGE_DELAY = (0, neo4j_driver_core_1.int)(30000);
var RoutingConnectionProvider = function(_super) {
    __extends(RoutingConnectionProvider, _super);
    function RoutingConnectionProvider(_a) {
        var id = _a.id, address = _a.address, routingContext = _a.routingContext, hostNameResolver = _a.hostNameResolver, config = _a.config, log = _a.log, userAgent = _a.userAgent, boltAgent = _a.boltAgent, authTokenManager = _a.authTokenManager, routingTablePurgeDelay = _a.routingTablePurgeDelay, newPool = _a.newPool;
        var _this = _super.call(this, {
            id: id,
            config: config,
            log: log,
            userAgent: userAgent,
            boltAgent: boltAgent,
            authTokenManager: authTokenManager,
            newPool: newPool
        }, function(address) {
            return __awaiter(_this, void 0, void 0, function() {
                var _a, _b;
                return __generator(this, function(_c) {
                    switch(_c.label){
                        case 0:
                            _a = connection_1.createChannelConnection;
                            _b = [
                                address,
                                this._config,
                                this._createConnectionErrorHandler(),
                                this._log
                            ];
                            return [
                                4 /*yield*/ ,
                                this._clientCertificateHolder.getClientCertificate()
                            ];
                        case 1:
                            return [
                                2 /*return*/ ,
                                _a.apply(void 0, _b.concat([
                                    _c.sent(),
                                    this._routingContext,
                                    this._channelSsrCallback.bind(this)
                                ]))
                            ];
                    }
                });
            });
        }) || this;
        _this._routingContext = __assign(__assign({}, routingContext), {
            address: address.toString()
        });
        _this._seedRouter = address;
        _this._rediscovery = new rediscovery_1.default(_this._routingContext);
        _this._loadBalancingStrategy = new load_balancing_1.LeastConnectedLoadBalancingStrategy(_this._connectionPool);
        _this._startTime = 0;
        _this._hostNameResolver = hostNameResolver;
        _this._dnsResolver = new channel_1.HostNameResolver();
        _this._log = log;
        _this._useSeedRouter = true;
        _this._routingTableRegistry = new RoutingTableRegistry(routingTablePurgeDelay ? (0, neo4j_driver_core_1.int)(routingTablePurgeDelay) : DEFAULT_ROUTING_TABLE_PURGE_DELAY);
        _this._refreshRoutingTable = lang_1.functional.reuseOngoingRequest(_this._refreshRoutingTable, _this);
        _this._withSSR = 0;
        _this._withoutSSR = 0;
        return _this;
    }
    RoutingConnectionProvider.prototype._createConnectionErrorHandler = function() {
        // connection errors mean SERVICE_UNAVAILABLE for direct driver but for routing driver they should only
        // result in SESSION_EXPIRED because there might still exist other servers capable of serving the request
        return new connection_1.ConnectionErrorHandler(SESSION_EXPIRED);
    };
    RoutingConnectionProvider.prototype._handleUnavailability = function(error, address, database) {
        this._log.warn("Routing driver ".concat(this._id, " will forget ").concat(address, " for database '").concat(database, "' because of an error ").concat(error.code, " '").concat(error.message, "'"));
        this.forget(address, database || DEFAULT_DB_NAME);
        return error;
    };
    RoutingConnectionProvider.prototype._handleSecurityError = function(error, address, connection, database) {
        this._log.warn("Routing driver ".concat(this._id, " will close connections to ").concat(address, " for database '").concat(database, "' because of an error ").concat(error.code, " '").concat(error.message, "'"));
        return _super.prototype._handleSecurityError.call(this, error, address, connection, database);
    };
    RoutingConnectionProvider.prototype._handleWriteFailure = function(error, address, database) {
        this._log.warn("Routing driver ".concat(this._id, " will forget writer ").concat(address, " for database '").concat(database, "' because of an error ").concat(error.code, " '").concat(error.message, "'"));
        this.forgetWriter(address, database || DEFAULT_DB_NAME);
        return (0, neo4j_driver_core_1.newError)('No longer possible to write to server at ' + address, SESSION_EXPIRED, error);
    };
    /**
     * See {@link ConnectionProvider} for more information about this method and
     * its arguments.
     */ RoutingConnectionProvider.prototype.acquireConnection = function() {
        return __awaiter(this, arguments, void 0, function(_a) {
            var context, databaseSpecificErrorHandler, conn, currentRoutingTable, routingTable;
            var _this = this;
            var _b = _a === void 0 ? {} : _a, accessMode = _b.accessMode, database = _b.database, bookmarks = _b.bookmarks, impersonatedUser = _b.impersonatedUser, onDatabaseNameResolved = _b.onDatabaseNameResolved, auth = _b.auth, homeDb = _b.homeDb;
            return __generator(this, function(_c) {
                switch(_c.label){
                    case 0:
                        context = {
                            database: database || DEFAULT_DB_NAME
                        };
                        databaseSpecificErrorHandler = new connection_1.ConnectionErrorHandler(SESSION_EXPIRED, function(error, address) {
                            return _this._handleUnavailability(error, address, context.database);
                        }, function(error, address) {
                            return _this._handleWriteFailure(error, address, homeDb !== null && homeDb !== void 0 ? homeDb : context.database);
                        }, function(error, address, conn) {
                            return _this._handleSecurityError(error, address, conn, context.database);
                        });
                        this._startTime = new Date().getTime();
                        if (!(this.SSREnabled() && homeDb !== undefined && database === '')) return [
                            3 /*break*/ ,
                            2
                        ];
                        currentRoutingTable = this._routingTableRegistry.get(homeDb, function() {
                            return new rediscovery_1.RoutingTable({
                                database: homeDb
                            });
                        });
                        if (!(currentRoutingTable && !currentRoutingTable.isStaleFor(accessMode))) return [
                            3 /*break*/ ,
                            2
                        ];
                        return [
                            4 /*yield*/ ,
                            this._getConnectionFromRoutingTable(currentRoutingTable, auth, accessMode, databaseSpecificErrorHandler)
                        ];
                    case 1:
                        conn = _c.sent();
                        if (this.SSREnabled()) {
                            return [
                                2 /*return*/ ,
                                conn
                            ];
                        }
                        conn.release();
                        _c.label = 2;
                    case 2:
                        return [
                            4 /*yield*/ ,
                            this._freshRoutingTable({
                                accessMode: accessMode,
                                database: context.database,
                                bookmarks: bookmarks,
                                impersonatedUser: impersonatedUser,
                                auth: auth,
                                onDatabaseNameResolved: function(databaseName) {
                                    context.database = context.database || databaseName;
                                    if (onDatabaseNameResolved) {
                                        onDatabaseNameResolved(databaseName);
                                    }
                                }
                            })
                        ];
                    case 3:
                        routingTable = _c.sent();
                        return [
                            2 /*return*/ ,
                            this._getConnectionFromRoutingTable(routingTable, auth, accessMode, databaseSpecificErrorHandler)
                        ];
                }
            });
        });
    };
    RoutingConnectionProvider.prototype._getConnectionFromRoutingTable = function(routingTable, auth, accessMode, databaseSpecificErrorHandler) {
        return __awaiter(this, void 0, void 0, function() {
            var name, address, connection, error_1, transformed;
            return __generator(this, function(_a) {
                switch(_a.label){
                    case 0:
                        // select a target server based on specified access mode
                        if (accessMode === READ) {
                            address = this._loadBalancingStrategy.selectReader(routingTable.readers);
                            name = 'read';
                        } else if (accessMode === WRITE) {
                            address = this._loadBalancingStrategy.selectWriter(routingTable.writers);
                            name = 'write';
                        } else {
                            throw (0, neo4j_driver_core_1.newError)('Illegal mode ' + accessMode);
                        }
                        // we couldn't select a target server
                        if (!address) {
                            throw (0, neo4j_driver_core_1.newError)("Failed to obtain connection towards ".concat(name, " server. Known routing table is: ").concat(routingTable), SESSION_EXPIRED);
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([
                            1,
                            5,
                            ,
                            6
                        ]);
                        return [
                            4 /*yield*/ ,
                            this._connectionPool.acquire({
                                auth: auth,
                                startTime: this._startTime
                            }, address)
                        ];
                    case 2:
                        connection = _a.sent();
                        if (!auth) return [
                            3 /*break*/ ,
                            4
                        ];
                        return [
                            4 /*yield*/ ,
                            this._verifyStickyConnection({
                                auth: auth,
                                connection: connection,
                                address: address
                            })
                        ];
                    case 3:
                        _a.sent();
                        return [
                            2 /*return*/ ,
                            connection
                        ];
                    case 4:
                        return [
                            2 /*return*/ ,
                            new connection_1.DelegateConnection(connection, databaseSpecificErrorHandler)
                        ];
                    case 5:
                        error_1 = _a.sent();
                        transformed = databaseSpecificErrorHandler.handleAndTransformError(error_1, address);
                        throw transformed;
                    case 6:
                        return [
                            2 /*return*/ 
                        ];
                }
            });
        });
    };
    RoutingConnectionProvider.prototype._hasProtocolVersion = function(versionPredicate) {
        return __awaiter(this, void 0, void 0, function() {
            var addresses, lastError, i, connection, protocolVersion, error_2;
            return __generator(this, function(_a) {
                switch(_a.label){
                    case 0:
                        return [
                            4 /*yield*/ ,
                            this._resolveSeedRouter(this._seedRouter)
                        ];
                    case 1:
                        addresses = _a.sent();
                        i = 0;
                        _a.label = 2;
                    case 2:
                        if (!(i < addresses.length)) return [
                            3 /*break*/ ,
                            8
                        ];
                        _a.label = 3;
                    case 3:
                        _a.trys.push([
                            3,
                            6,
                            ,
                            7
                        ]);
                        return [
                            4 /*yield*/ ,
                            this._createChannelConnection(addresses[i])
                        ];
                    case 4:
                        connection = _a.sent();
                        protocolVersion = connection.protocol() ? connection.protocol().version : null;
                        return [
                            4 /*yield*/ ,
                            connection.close()
                        ];
                    case 5:
                        _a.sent();
                        if (protocolVersion) {
                            return [
                                2 /*return*/ ,
                                versionPredicate(protocolVersion)
                            ];
                        }
                        return [
                            2 /*return*/ ,
                            false
                        ];
                    case 6:
                        error_2 = _a.sent();
                        lastError = error_2;
                        return [
                            3 /*break*/ ,
                            7
                        ];
                    case 7:
                        i++;
                        return [
                            3 /*break*/ ,
                            2
                        ];
                    case 8:
                        if (lastError) {
                            throw lastError;
                        }
                        return [
                            2 /*return*/ ,
                            false
                        ];
                }
            });
        });
    };
    RoutingConnectionProvider.prototype.supportsMultiDb = function() {
        return __awaiter(this, void 0, void 0, function() {
            return __generator(this, function(_a) {
                switch(_a.label){
                    case 0:
                        return [
                            4 /*yield*/ ,
                            this._hasProtocolVersion(function(version) {
                                return version.isGreaterOrEqualTo(BOLT_PROTOCOL_V4_0);
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
    RoutingConnectionProvider.prototype.supportsTransactionConfig = function() {
        return __awaiter(this, void 0, void 0, function() {
            return __generator(this, function(_a) {
                switch(_a.label){
                    case 0:
                        return [
                            4 /*yield*/ ,
                            this._hasProtocolVersion(function(version) {
                                return version.isGreaterOrEqualTo(BOLT_PROTOCOL_V3);
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
    RoutingConnectionProvider.prototype.supportsUserImpersonation = function() {
        return __awaiter(this, void 0, void 0, function() {
            return __generator(this, function(_a) {
                switch(_a.label){
                    case 0:
                        return [
                            4 /*yield*/ ,
                            this._hasProtocolVersion(function(version) {
                                return version.isGreaterOrEqualTo(BOLT_PROTOCOL_V4_4);
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
    RoutingConnectionProvider.prototype.supportsSessionAuth = function() {
        return __awaiter(this, void 0, void 0, function() {
            return __generator(this, function(_a) {
                switch(_a.label){
                    case 0:
                        return [
                            4 /*yield*/ ,
                            this._hasProtocolVersion(function(version) {
                                return version.isGreaterOrEqualTo(BOLT_PROTOCOL_V5_1);
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
    RoutingConnectionProvider.prototype.getNegotiatedProtocolVersion = function() {
        var _this = this;
        return new Promise(function(resolve, reject) {
            _this._hasProtocolVersion(resolve).catch(reject);
        });
    };
    RoutingConnectionProvider.prototype.verifyAuthentication = function(_a) {
        return __awaiter(this, arguments, void 0, function(_b) {
            var _this = this;
            var database = _b.database, accessMode = _b.accessMode, auth = _b.auth;
            return __generator(this, function(_c) {
                this._startTime = new Date().getTime();
                return [
                    2 /*return*/ ,
                    this._verifyAuthentication({
                        auth: auth,
                        getAddress: function() {
                            return __awaiter(_this, void 0, void 0, function() {
                                var context, routingTable, servers;
                                return __generator(this, function(_a) {
                                    switch(_a.label){
                                        case 0:
                                            context = {
                                                database: database || DEFAULT_DB_NAME
                                            };
                                            return [
                                                4 /*yield*/ ,
                                                this._freshRoutingTable({
                                                    accessMode: accessMode,
                                                    database: context.database,
                                                    auth: auth,
                                                    onDatabaseNameResolved: function(databaseName) {
                                                        context.database = context.database || databaseName;
                                                    }
                                                })
                                            ];
                                        case 1:
                                            routingTable = _a.sent();
                                            servers = accessMode === WRITE ? routingTable.writers : routingTable.readers;
                                            if (servers.length === 0) {
                                                throw (0, neo4j_driver_core_1.newError)("No servers available for database '".concat(context.database, "' with access mode '").concat(accessMode, "'"), SERVICE_UNAVAILABLE);
                                            }
                                            return [
                                                2 /*return*/ ,
                                                servers[0]
                                            ];
                                    }
                                });
                            });
                        }
                    })
                ];
            });
        });
    };
    RoutingConnectionProvider.prototype.verifyConnectivityAndGetServerInfo = function(_a) {
        return __awaiter(this, arguments, void 0, function(_b) {
            var context, routingTable, servers, error, servers_1, servers_1_1, address, serverInfo, e_1, e_2_1;
            var e_2, _c;
            var database = _b.database, accessMode = _b.accessMode;
            return __generator(this, function(_d) {
                switch(_d.label){
                    case 0:
                        context = {
                            database: database || DEFAULT_DB_NAME
                        };
                        this._startTime = new Date().getTime();
                        return [
                            4 /*yield*/ ,
                            this._freshRoutingTable({
                                accessMode: accessMode,
                                database: context.database,
                                onDatabaseNameResolved: function(databaseName) {
                                    context.database = context.database || databaseName;
                                }
                            })
                        ];
                    case 1:
                        routingTable = _d.sent();
                        servers = accessMode === WRITE ? routingTable.writers : routingTable.readers;
                        error = (0, neo4j_driver_core_1.newError)("No servers available for database '".concat(context.database, "' with access mode '").concat(accessMode, "'"), SERVICE_UNAVAILABLE);
                        _d.label = 2;
                    case 2:
                        _d.trys.push([
                            2,
                            9,
                            10,
                            11
                        ]);
                        servers_1 = __values(servers), servers_1_1 = servers_1.next();
                        _d.label = 3;
                    case 3:
                        if (!!servers_1_1.done) return [
                            3 /*break*/ ,
                            8
                        ];
                        address = servers_1_1.value;
                        _d.label = 4;
                    case 4:
                        _d.trys.push([
                            4,
                            6,
                            ,
                            7
                        ]);
                        return [
                            4 /*yield*/ ,
                            this._verifyConnectivityAndGetServerVersion({
                                address: address
                            })
                        ];
                    case 5:
                        serverInfo = _d.sent();
                        return [
                            2 /*return*/ ,
                            serverInfo
                        ];
                    case 6:
                        e_1 = _d.sent();
                        error = e_1;
                        return [
                            3 /*break*/ ,
                            7
                        ];
                    case 7:
                        servers_1_1 = servers_1.next();
                        return [
                            3 /*break*/ ,
                            3
                        ];
                    case 8:
                        return [
                            3 /*break*/ ,
                            11
                        ];
                    case 9:
                        e_2_1 = _d.sent();
                        e_2 = {
                            error: e_2_1
                        };
                        return [
                            3 /*break*/ ,
                            11
                        ];
                    case 10:
                        try {
                            if (servers_1_1 && !servers_1_1.done && (_c = servers_1.return)) _c.call(servers_1);
                        } finally{
                            if (e_2) throw e_2.error;
                        }
                        return [
                            7 /*endfinally*/ 
                        ];
                    case 11:
                        throw error;
                }
            });
        });
    };
    RoutingConnectionProvider.prototype.forget = function(address, database) {
        this._routingTableRegistry.apply(database, {
            applyWhenExists: function(routingTable) {
                return routingTable.forget(address);
            }
        });
        // We're firing and forgetting this operation explicitly and listening for any
        // errors to avoid unhandled promise rejection
        this._connectionPool.purge(address).catch(function() {});
    };
    RoutingConnectionProvider.prototype.forgetWriter = function(address, database) {
        this._routingTableRegistry.apply(database, {
            applyWhenExists: function(routingTable) {
                return routingTable.forgetWriter(address);
            }
        });
    };
    RoutingConnectionProvider.prototype._freshRoutingTable = function(_a) {
        var _b = _a === void 0 ? {} : _a, accessMode = _b.accessMode, database = _b.database, bookmarks = _b.bookmarks, impersonatedUser = _b.impersonatedUser, onDatabaseNameResolved = _b.onDatabaseNameResolved, auth = _b.auth;
        var currentRoutingTable = this._routingTableRegistry.get(database, function() {
            return new rediscovery_1.RoutingTable({
                database: database
            });
        });
        if (!currentRoutingTable.isStaleFor(accessMode)) {
            return currentRoutingTable;
        }
        this._log.info("Routing table is stale for database: \"".concat(database, "\" and access mode: \"").concat(accessMode, "\": ").concat(currentRoutingTable));
        return this._refreshRoutingTable(currentRoutingTable, bookmarks, impersonatedUser, auth).then(function(newRoutingTable) {
            onDatabaseNameResolved(newRoutingTable.database);
            return newRoutingTable;
        });
    };
    RoutingConnectionProvider.prototype._refreshRoutingTable = function(currentRoutingTable, bookmarks, impersonatedUser, auth) {
        var knownRouters = currentRoutingTable.routers;
        if (this._useSeedRouter) {
            return this._fetchRoutingTableFromSeedRouterFallbackToKnownRouters(knownRouters, currentRoutingTable, bookmarks, impersonatedUser, auth);
        }
        return this._fetchRoutingTableFromKnownRoutersFallbackToSeedRouter(knownRouters, currentRoutingTable, bookmarks, impersonatedUser, auth);
    };
    RoutingConnectionProvider.prototype._fetchRoutingTableFromSeedRouterFallbackToKnownRouters = function(knownRouters, currentRoutingTable, bookmarks, impersonatedUser, auth) {
        return __awaiter(this, void 0, void 0, function() {
            var seenRouters, _a, newRoutingTable, error, _b, newRoutingTable2, error2;
            return __generator(this, function(_c) {
                switch(_c.label){
                    case 0:
                        seenRouters = [];
                        return [
                            4 /*yield*/ ,
                            this._fetchRoutingTableUsingSeedRouter(seenRouters, this._seedRouter, currentRoutingTable, bookmarks, impersonatedUser, auth)
                        ];
                    case 1:
                        _a = __read.apply(void 0, [
                            _c.sent(),
                            2
                        ]), newRoutingTable = _a[0], error = _a[1];
                        if (!newRoutingTable) return [
                            3 /*break*/ ,
                            2
                        ];
                        this._useSeedRouter = false;
                        return [
                            3 /*break*/ ,
                            4
                        ];
                    case 2:
                        return [
                            4 /*yield*/ ,
                            this._fetchRoutingTableUsingKnownRouters(knownRouters, currentRoutingTable, bookmarks, impersonatedUser, auth)
                        ];
                    case 3:
                        _b = __read.apply(void 0, [
                            _c.sent(),
                            2
                        ]), newRoutingTable2 = _b[0], error2 = _b[1];
                        newRoutingTable = newRoutingTable2;
                        error = error2 || error;
                        _c.label = 4;
                    case 4:
                        return [
                            4 /*yield*/ ,
                            this._applyRoutingTableIfPossible(currentRoutingTable, newRoutingTable, error)
                        ];
                    case 5:
                        return [
                            2 /*return*/ ,
                            _c.sent()
                        ];
                }
            });
        });
    };
    RoutingConnectionProvider.prototype._fetchRoutingTableFromKnownRoutersFallbackToSeedRouter = function(knownRouters, currentRoutingTable, bookmarks, impersonatedUser, auth) {
        return __awaiter(this, void 0, void 0, function() {
            var _a, newRoutingTable, error;
            var _b;
            return __generator(this, function(_c) {
                switch(_c.label){
                    case 0:
                        return [
                            4 /*yield*/ ,
                            this._fetchRoutingTableUsingKnownRouters(knownRouters, currentRoutingTable, bookmarks, impersonatedUser, auth)
                        ];
                    case 1:
                        _a = __read.apply(void 0, [
                            _c.sent(),
                            2
                        ]), newRoutingTable = _a[0], error = _a[1];
                        if (!!newRoutingTable) return [
                            3 /*break*/ ,
                            3
                        ];
                        return [
                            4 /*yield*/ ,
                            this._fetchRoutingTableUsingSeedRouter(knownRouters, this._seedRouter, currentRoutingTable, bookmarks, impersonatedUser, auth)
                        ];
                    case 2:
                        // none of the known routers returned a valid routing table - try to use seed router address for rediscovery
                        _b = __read.apply(void 0, [
                            _c.sent(),
                            2
                        ]), newRoutingTable = _b[0], error = _b[1];
                        _c.label = 3;
                    case 3:
                        return [
                            4 /*yield*/ ,
                            this._applyRoutingTableIfPossible(currentRoutingTable, newRoutingTable, error)
                        ];
                    case 4:
                        return [
                            2 /*return*/ ,
                            _c.sent()
                        ];
                }
            });
        });
    };
    RoutingConnectionProvider.prototype._fetchRoutingTableUsingKnownRouters = function(knownRouters, currentRoutingTable, bookmarks, impersonatedUser, auth) {
        return __awaiter(this, void 0, void 0, function() {
            var _a, newRoutingTable, error, lastRouterIndex;
            return __generator(this, function(_b) {
                switch(_b.label){
                    case 0:
                        return [
                            4 /*yield*/ ,
                            this._fetchRoutingTable(knownRouters, currentRoutingTable, bookmarks, impersonatedUser, auth)
                        ];
                    case 1:
                        _a = __read.apply(void 0, [
                            _b.sent(),
                            2
                        ]), newRoutingTable = _a[0], error = _a[1];
                        if (newRoutingTable) {
                            // one of the known routers returned a valid routing table - use it
                            return [
                                2 /*return*/ ,
                                [
                                    newRoutingTable,
                                    null
                                ]
                            ];
                        }
                        lastRouterIndex = knownRouters.length - 1;
                        RoutingConnectionProvider._forgetRouter(currentRoutingTable, knownRouters, lastRouterIndex);
                        return [
                            2 /*return*/ ,
                            [
                                null,
                                error
                            ]
                        ];
                }
            });
        });
    };
    RoutingConnectionProvider.prototype._fetchRoutingTableUsingSeedRouter = function(seenRouters, seedRouter, routingTable, bookmarks, impersonatedUser, auth) {
        return __awaiter(this, void 0, void 0, function() {
            var resolvedAddresses, newAddresses;
            return __generator(this, function(_a) {
                switch(_a.label){
                    case 0:
                        return [
                            4 /*yield*/ ,
                            this._resolveSeedRouter(seedRouter)
                        ];
                    case 1:
                        resolvedAddresses = _a.sent();
                        newAddresses = resolvedAddresses.filter(function(address) {
                            return seenRouters.indexOf(address) < 0;
                        });
                        return [
                            4 /*yield*/ ,
                            this._fetchRoutingTable(newAddresses, routingTable, bookmarks, impersonatedUser, auth)
                        ];
                    case 2:
                        return [
                            2 /*return*/ ,
                            _a.sent()
                        ];
                }
            });
        });
    };
    RoutingConnectionProvider.prototype._resolveSeedRouter = function(seedRouter) {
        return __awaiter(this, void 0, void 0, function() {
            var resolvedAddresses, dnsResolvedAddresses;
            var _this = this;
            return __generator(this, function(_a) {
                switch(_a.label){
                    case 0:
                        return [
                            4 /*yield*/ ,
                            this._hostNameResolver.resolve(seedRouter)
                        ];
                    case 1:
                        resolvedAddresses = _a.sent();
                        return [
                            4 /*yield*/ ,
                            Promise.all(resolvedAddresses.map(function(address) {
                                return _this._dnsResolver.resolve(address);
                            }))
                        ];
                    case 2:
                        dnsResolvedAddresses = _a.sent();
                        return [
                            2 /*return*/ ,
                            [].concat.apply([], dnsResolvedAddresses)
                        ];
                }
            });
        });
    };
    RoutingConnectionProvider.prototype._fetchRoutingTable = function(routerAddresses, routingTable, bookmarks, impersonatedUser, auth) {
        return __awaiter(this, void 0, void 0, function() {
            var _this = this;
            return __generator(this, function(_a) {
                return [
                    2 /*return*/ ,
                    routerAddresses.reduce(function(refreshedTablePromise, currentRouter, currentIndex) {
                        return __awaiter(_this, void 0, void 0, function() {
                            var _a, newRoutingTable, previousRouterIndex, _b, session, error, error_3;
                            return __generator(this, function(_c) {
                                switch(_c.label){
                                    case 0:
                                        return [
                                            4 /*yield*/ ,
                                            refreshedTablePromise
                                        ];
                                    case 1:
                                        _a = __read.apply(void 0, [
                                            _c.sent(),
                                            1
                                        ]), newRoutingTable = _a[0];
                                        if (newRoutingTable) {
                                            // valid routing table was fetched - just return it, try next router otherwise
                                            return [
                                                2 /*return*/ ,
                                                [
                                                    newRoutingTable,
                                                    null
                                                ]
                                            ];
                                        } else {
                                            previousRouterIndex = currentIndex - 1;
                                            RoutingConnectionProvider._forgetRouter(routingTable, routerAddresses, previousRouterIndex);
                                        }
                                        return [
                                            4 /*yield*/ ,
                                            this._createSessionForRediscovery(currentRouter, bookmarks, impersonatedUser, auth)
                                        ];
                                    case 2:
                                        _b = __read.apply(void 0, [
                                            _c.sent(),
                                            2
                                        ]), session = _b[0], error = _b[1];
                                        if (!session) return [
                                            3 /*break*/ ,
                                            8
                                        ];
                                        _c.label = 3;
                                    case 3:
                                        _c.trys.push([
                                            3,
                                            5,
                                            6,
                                            7
                                        ]);
                                        return [
                                            4 /*yield*/ ,
                                            this._rediscovery.lookupRoutingTableOnRouter(session, routingTable.database, currentRouter, impersonatedUser)
                                        ];
                                    case 4:
                                        return [
                                            2 /*return*/ ,
                                            [
                                                _c.sent(),
                                                null
                                            ]
                                        ];
                                    case 5:
                                        error_3 = _c.sent();
                                        return [
                                            2 /*return*/ ,
                                            this._handleRediscoveryError(error_3, currentRouter)
                                        ];
                                    case 6:
                                        session.close();
                                        return [
                                            7 /*endfinally*/ 
                                        ];
                                    case 7:
                                        return [
                                            3 /*break*/ ,
                                            9
                                        ];
                                    case 8:
                                        // unable to acquire connection and create session towards the current router
                                        // return null to signal that the next router should be tried
                                        return [
                                            2 /*return*/ ,
                                            [
                                                null,
                                                error
                                            ]
                                        ];
                                    case 9:
                                        return [
                                            2 /*return*/ 
                                        ];
                                }
                            });
                        });
                    }, Promise.resolve([
                        null,
                        null
                    ]))
                ];
            });
        });
    };
    RoutingConnectionProvider.prototype._createSessionForRediscovery = function(routerAddress, bookmarks, impersonatedUser, auth) {
        return __awaiter(this, void 0, void 0, function() {
            var connection, databaseSpecificErrorHandler, delegateConnection, connectionProvider, protocolVersion, error_4;
            var _this = this;
            return __generator(this, function(_a) {
                switch(_a.label){
                    case 0:
                        _a.trys.push([
                            0,
                            4,
                            ,
                            5
                        ]);
                        return [
                            4 /*yield*/ ,
                            this._connectionPool.acquire({
                                auth: auth,
                                startTime: this._startTime
                            }, routerAddress)
                        ];
                    case 1:
                        connection = _a.sent();
                        if (!auth) return [
                            3 /*break*/ ,
                            3
                        ];
                        return [
                            4 /*yield*/ ,
                            this._verifyStickyConnection({
                                auth: auth,
                                connection: connection,
                                address: routerAddress
                            })
                        ];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        databaseSpecificErrorHandler = connection_1.ConnectionErrorHandler.create({
                            errorCode: SESSION_EXPIRED,
                            handleSecurityError: function(error, address, conn) {
                                return _this._handleSecurityError(error, address, conn);
                            }
                        });
                        delegateConnection = !connection._sticky ? new connection_1.DelegateConnection(connection, databaseSpecificErrorHandler) : new connection_1.DelegateConnection(connection);
                        connectionProvider = new connection_provider_single_1.default(delegateConnection);
                        protocolVersion = connection.protocol().version;
                        if (protocolVersion.isLessThan({
                            major: 4,
                            minor: 0
                        })) {
                            return [
                                2 /*return*/ ,
                                [
                                    new neo4j_driver_core_1.Session({
                                        mode: WRITE,
                                        bookmarks: Bookmarks.empty(),
                                        connectionProvider: connectionProvider
                                    }),
                                    null
                                ]
                            ];
                        }
                        return [
                            2 /*return*/ ,
                            [
                                new neo4j_driver_core_1.Session({
                                    mode: READ,
                                    database: SYSTEM_DB_NAME,
                                    bookmarks: bookmarks,
                                    connectionProvider: connectionProvider,
                                    impersonatedUser: impersonatedUser
                                }),
                                null
                            ]
                        ];
                    case 4:
                        error_4 = _a.sent();
                        return [
                            2 /*return*/ ,
                            this._handleRediscoveryError(error_4, routerAddress)
                        ];
                    case 5:
                        return [
                            2 /*return*/ 
                        ];
                }
            });
        });
    };
    RoutingConnectionProvider.prototype._handleRediscoveryError = function(error, routerAddress) {
        if (_isFailFastError(error) || _isFailFastSecurityError(error)) {
            throw error;
        } else if (error.code === PROCEDURE_NOT_FOUND_CODE) {
            // throw when getServers procedure not found because this is clearly a configuration issue
            throw (0, neo4j_driver_core_1.newError)("Server at ".concat(routerAddress.asHostPort(), " can't perform routing. Make sure you are connecting to a causal cluster"), SERVICE_UNAVAILABLE, error);
        }
        this._log.warn("unable to fetch routing table because of an error ".concat(error));
        return [
            null,
            error
        ];
    };
    RoutingConnectionProvider.prototype._applyRoutingTableIfPossible = function(currentRoutingTable, newRoutingTable, error) {
        return __awaiter(this, void 0, void 0, function() {
            return __generator(this, function(_a) {
                switch(_a.label){
                    case 0:
                        if (!newRoutingTable) {
                            // none of routing servers returned valid routing table, throw exception
                            throw (0, neo4j_driver_core_1.newError)("Could not perform discovery. No routing servers available. Known routing table: ".concat(currentRoutingTable), SERVICE_UNAVAILABLE, error);
                        }
                        if (newRoutingTable.writers.length === 0) {
                            // use seed router next time. this is important when cluster is partitioned. it tries to make sure driver
                            // does not always get routing table without writers because it talks exclusively to a minority partition
                            this._useSeedRouter = true;
                        }
                        return [
                            4 /*yield*/ ,
                            this._updateRoutingTable(newRoutingTable)
                        ];
                    case 1:
                        _a.sent();
                        return [
                            2 /*return*/ ,
                            newRoutingTable
                        ];
                }
            });
        });
    };
    RoutingConnectionProvider.prototype._updateRoutingTable = function(newRoutingTable) {
        return __awaiter(this, void 0, void 0, function() {
            return __generator(this, function(_a) {
                switch(_a.label){
                    case 0:
                        // close old connections to servers not present in the new routing table
                        return [
                            4 /*yield*/ ,
                            this._connectionPool.keepAll(newRoutingTable.allServers())
                        ];
                    case 1:
                        // close old connections to servers not present in the new routing table
                        _a.sent();
                        this._routingTableRegistry.removeExpired();
                        this._routingTableRegistry.register(newRoutingTable);
                        this._log.info("Updated routing table ".concat(newRoutingTable));
                        return [
                            2 /*return*/ 
                        ];
                }
            });
        });
    };
    RoutingConnectionProvider._forgetRouter = function(routingTable, routersArray, routerIndex) {
        var address = routersArray[routerIndex];
        if (routingTable && address) {
            routingTable.forgetRouter(address);
        }
    };
    RoutingConnectionProvider.prototype._channelSsrCallback = function(isEnabled, action) {
        if (action === 'OPEN') {
            if (isEnabled === true) {
                this._withSSR = this._withSSR + 1;
            } else {
                this._withoutSSR = this._withoutSSR + 1;
            }
        } else if (action === 'CLOSE') {
            if (isEnabled === true) {
                this._withSSR = this._withSSR - 1;
            } else {
                this._withoutSSR = this._withoutSSR - 1;
            }
        } else {
            throw (0, neo4j_driver_core_1.newError)("Channel SSR Callback invoked with action other than 'OPEN' or 'CLOSE'");
        }
    };
    RoutingConnectionProvider.prototype.SSREnabled = function() {
        return this._withSSR > 0 && this._withoutSSR === 0;
    };
    return RoutingConnectionProvider;
}(connection_provider_pooled_1.default);
exports.default = RoutingConnectionProvider;
/**
 * Responsible for keeping track of the existing routing tables
 */ var RoutingTableRegistry = function() {
    /**
     * Constructor
     * @param {int} routingTablePurgeDelay The routing table purge delay
     */ function RoutingTableRegistry(routingTablePurgeDelay) {
        this._tables = new Map();
        this._routingTablePurgeDelay = routingTablePurgeDelay;
    }
    /**
     * Put a routing table in the registry
     *
     * @param {RoutingTable} table The routing table
     * @returns {RoutingTableRegistry} this
     */ RoutingTableRegistry.prototype.register = function(table) {
        this._tables.set(table.database, table);
        return this;
    };
    /**
     * Apply function in the routing table for an specific database. If the database name is not defined, the function will
     * be applied for each element
     *
     * @param {string} database The database name
     * @param {object} callbacks The actions
     * @param {function (RoutingTable)} callbacks.applyWhenExists Call when the db exists or when the database property is not informed
     * @param {function ()} callbacks.applyWhenDontExists Call when the database doesn't have the routing table registred
     * @returns {RoutingTableRegistry} this
     */ RoutingTableRegistry.prototype.apply = function(database, _a) {
        var _b = _a === void 0 ? {} : _a, applyWhenExists = _b.applyWhenExists, _c = _b.applyWhenDontExists, applyWhenDontExists = _c === void 0 ? function() {} : _c;
        if (this._tables.has(database)) {
            applyWhenExists(this._tables.get(database));
        } else if (typeof database === 'string' || database === null) {
            applyWhenDontExists();
        } else {
            this._forEach(applyWhenExists);
        }
        return this;
    };
    /**
     * Retrieves a routing table from a given database name
     *
     * @param {string|impersonatedUser} impersonatedUser The impersonated User
     * @param {string} database The database name
     * @param {function()|RoutingTable} defaultSupplier The routing table supplier, if it's not a function or not exists, it will return itself as default value
     * @returns {RoutingTable} The routing table for the respective database
     */ RoutingTableRegistry.prototype.get = function(database, defaultSupplier) {
        if (this._tables.has(database)) {
            return this._tables.get(database);
        }
        return typeof defaultSupplier === 'function' ? defaultSupplier() : defaultSupplier;
    };
    /**
     * Remove the routing table which is already expired
     * @returns {RoutingTableRegistry} this
     */ RoutingTableRegistry.prototype.removeExpired = function() {
        var _this = this;
        return this._removeIf(function(value) {
            return value.isExpiredFor(_this._routingTablePurgeDelay);
        });
    };
    RoutingTableRegistry.prototype._forEach = function(apply) {
        var e_3, _a;
        try {
            for(var _b = __values(this._tables), _c = _b.next(); !_c.done; _c = _b.next()){
                var _d = __read(_c.value, 2), value = _d[1];
                apply(value);
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
        return this;
    };
    RoutingTableRegistry.prototype._remove = function(key) {
        this._tables.delete(key);
        return this;
    };
    RoutingTableRegistry.prototype._removeIf = function(predicate) {
        var e_4, _a;
        try {
            for(var _b = __values(this._tables), _c = _b.next(); !_c.done; _c = _b.next()){
                var _d = __read(_c.value, 2), key = _d[0], value = _d[1];
                if (predicate(value)) {
                    this._remove(key);
                }
            }
        } catch (e_4_1) {
            e_4 = {
                error: e_4_1
            };
        } finally{
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            } finally{
                if (e_4) throw e_4.error;
            }
        }
        return this;
    };
    return RoutingTableRegistry;
}();
function _isFailFastError(error) {
    return [
        DATABASE_NOT_FOUND_CODE,
        INVALID_BOOKMARK_CODE,
        INVALID_BOOKMARK_MIXTURE_CODE,
        INVALID_ARGUMENT_ERROR,
        INVALID_REQUEST_ERROR,
        STATEMENT_TYPE_ERROR,
        NOT_AVAILABLE
    ].includes(error.code);
}
function _isFailFastSecurityError(error) {
    var _a;
    return ((_a = error.code) === null || _a === void 0 ? void 0 : _a.startsWith('Neo.ClientError.Security.')) && ![
        AUTHORIZATION_EXPIRED_CODE
    ].includes(error.code);
}
}),
"[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/connection-provider/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

var __importDefault = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : {
        "default": mod
    };
};
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.RoutingConnectionProvider = exports.DirectConnectionProvider = exports.PooledConnectionProvider = exports.SingleConnectionProvider = void 0;
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
 */ var connection_provider_single_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/connection-provider/connection-provider-single.js [app-route] (ecmascript)");
Object.defineProperty(exports, "SingleConnectionProvider", {
    enumerable: true,
    get: function() {
        return __importDefault(connection_provider_single_1).default;
    }
});
var connection_provider_pooled_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/connection-provider/connection-provider-pooled.js [app-route] (ecmascript)");
Object.defineProperty(exports, "PooledConnectionProvider", {
    enumerable: true,
    get: function() {
        return __importDefault(connection_provider_pooled_1).default;
    }
});
var connection_provider_direct_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/connection-provider/connection-provider-direct.js [app-route] (ecmascript)");
Object.defineProperty(exports, "DirectConnectionProvider", {
    enumerable: true,
    get: function() {
        return __importDefault(connection_provider_direct_1).default;
    }
});
var connection_provider_routing_1 = __turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/connection-provider/connection-provider-routing.js [app-route] (ecmascript)");
Object.defineProperty(exports, "RoutingConnectionProvider", {
    enumerable: true,
    get: function() {
        return __importDefault(connection_provider_routing_1).default;
    }
});
}),
"[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/index.js [app-route] (ecmascript)", ((__turbopack_context__, module, exports) => {
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
var __exportStar = /*TURBOPACK member replacement*/ __turbopack_context__.e && /*TURBOPACK member replacement*/ __turbopack_context__.e.__exportStar || function(m, exports1) {
    for(var p in m)if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports1, p)) __createBinding(exports1, m, p);
};
Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.packstream = exports.channel = exports.buf = exports.bolt = exports.loadBalancing = void 0;
exports.loadBalancing = __importStar(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/load-balancing/index.js [app-route] (ecmascript)"));
exports.bolt = __importStar(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/bolt/index.js [app-route] (ecmascript)"));
exports.buf = __importStar(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/buf/index.js [app-route] (ecmascript)"));
exports.channel = __importStar(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/channel/index.js [app-route] (ecmascript)"));
exports.packstream = __importStar(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/packstream/index.js [app-route] (ecmascript)"));
__exportStar(__turbopack_context__.r("[project]/frontend/node_modules/neo4j-driver-bolt-connection/lib/connection-provider/index.js [app-route] (ecmascript)"), exports);
}),
];

//# sourceMappingURL=9e883_neo4j-driver-bolt-connection_lib_bb12591c._.js.map