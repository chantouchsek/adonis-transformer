"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const src_1 = __importDefault(require("../src"));
const TransformerAbstract_1 = __importDefault(require("../src/TransformerAbstract"));
class AppProvider {
    constructor(app) {
        this.app = app;
    }
    register() {
        // Register your own bindings
        this.app.container.singleton('Adonis/Addons/Transformer', () => ({
            TransformerAbstract: TransformerAbstract_1.default,
            Transformer: src_1.default,
        }));
    }
    boot() {
        // IoC container is ready
        const Context = this.app.container.use('Adonis/Core/HttpContext');
        Context.getter('transform', () => {
            return src_1.default.create().withContext(this);
        }, true);
    }
    shutdown() {
        // Cleanup, since app is going down
    }
    ready() {
        // App is ready
    }
}
exports.default = AppProvider;
AppProvider.needsApplication = true;
