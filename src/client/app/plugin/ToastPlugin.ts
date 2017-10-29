import {CordovaPlugin} from "./CordovaPlugin";

/**
 * cordova-plugin-x-toast
 */
export class ToastPlugin extends CordovaPlugin {
    private toast: any;

    constructor() {
        super();
        this.toast = window.plugins && window.plugins['toast'];
        if (!this.toast) {
            this.mock();
        }
    }

    show(message: string, duration?: string, position?: string) {
        duration = duration || 'short';
        position = position || 'bottom';
        this.toast.show(message, duration, position);
    }

    protected mock(): void {
        this.mockingMode = true;
        this.toast = {
            show: (message) => {
                console.log('Mocking Toast Plugin: show');
                alert(message);
            },
            hide: () => {
                console.log('Mocking Toast Plugin: hide');
            }
        };
    }
}
