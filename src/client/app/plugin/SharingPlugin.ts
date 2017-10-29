import {CordovaPlugin} from "./CordovaPlugin";

/**
 * cordova-plugin-x-socialsharing
 */
export class SharingPlugin extends CordovaPlugin {
    private socialSharing: any;

    constructor() {
        super();
        this.socialSharing = window.plugins && window.plugins.socialsharing;
        //<development>
        if (!this.socialSharing) {
            this.mock();
        }
        //</development>
    }

    public shareMessage(message: string, subject?: string) {
        this.socialSharing.share(message, subject);
    }

    public shareImage(message: string, subject: string, image: string, link?: string) {
        this.socialSharing.share(message, subject, image, link);
    }

    //<development>
    protected mock(): void {
        this.mockingMode = true;
        this.socialSharing = {
            share: function (message?: string, subject?: string, file?: string, link?: string) {
                console.log(`Mocking SocialSharing plugin: share(${message}, ${subject}, ${file}, ${link})`);
            }
        };
    }

    //</development>
}
