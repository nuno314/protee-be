export class StringHelper {
    static generateSlug(str: string): string {
        str = this.removeSign4VietnameseString(str).toLowerCase();
        // invalid chars
        str = str.replace('[^a-z0-9s-]', '');
        // convert multiple spaces into one space
        str = str.replace('s+', ' ').trim();
        // cut and trim
        str = str.replace(/ /g, '-'); // hyphens
        // remove double hyphens
        str = str.replace('-+', '-');

        str = str.replace(/[./,!#*+?^$%@&{}():;|[\]\\-]/g, '-');

        str = this.recheckSlug(str);

        return str;
    }

    static removeSign4VietnameseString(str: string): string {
        str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
        str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
        str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
        str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
        str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
        str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
        str = str.replace(/đ/g, 'd');
        str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, 'A');
        str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, 'E');
        str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, 'I');
        str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, 'O');
        str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, 'U');
        str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, 'Y');
        str = str.replace(/Đ/g, 'D');
        return str;
    }

    static recheckSlug(text: string): string {
        if (this.isNullOrWhitespace(text)) {
            return text;
        }
        while (text.includes('--')) {
            text = text.replace('--', '-');
        }
        return text;
    }

    static isNullOrWhitespace(input: any): boolean {
        if (typeof input === 'undefined' || input == null) return true;

        return input.replace(/\s/g, '').length < 1;
    }

    static randomString(length: number): string {
        let result = '';
        // const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }
    static getFileMimetype(file: Express.Multer.File): string {
        switch (file.mimetype) {
            case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
                return 'docx';
            case 'application/pdf':
                return 'pdf';
            case 'image/png':
            case 'image/jpeg':
                return 'png';
            default:
                null;
        }
    }
}
