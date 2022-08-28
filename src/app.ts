import {Converter} from  'showdown';
import * as Mustache from 'mustache';
import wkhtmltopdf from "wkhtmltopdf";
import * as fs from 'fs';

type KeyedOptions<T,K extends keyof T,V> = {[k in K]: V}
interface MarkdownPDFRenderParams {
    templateName: string,
    templateVariables: Map<string,string>,
    theme: string
}
type MarkdownPDFRenderOptions = KeyedOptions<MarkdownPDFRenderParams, keyof MarkdownPDFRenderParams, any>

function generatePDF(fileName: string, settings: MarkdownPDFRenderOptions) {
    const mdtemplate = fs.readFileSync(`./templates/${settings.templateName}.md`, 'utf8');
    const theme = fs.readFileSync(`./theme/${settings.theme}.html`, 'utf8');
    const mdtext = Mustache.render(mdtemplate, settings.templateVariables);
    const converter = new Converter({moreStyling: true});
    const html = Mustache.render(theme, { body: converter.makeHtml(mdtext) });
    fs.writeFileSync("./out/render.html",html);
    wkhtmltopdf(html, { pageSize: 'A4' }).pipe(fs.createWriteStream(fileName));
}

const settings: MarkdownPDFRenderOptions = {
    templateName: 'nda',
    templateVariables: { company: 'Setu', tparty: 'Aagya' },
    theme:  'modest'
}

generatePDF('./out/out.pdf', settings);