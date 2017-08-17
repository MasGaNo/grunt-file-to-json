import { minify } from 'html-minifier';

export = function htmlminifier(htmlContent: string, options: any) {
    return minify(htmlContent, options);
}