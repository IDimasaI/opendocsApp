import DOMPurify from "dompurify";
class MarkdownParser {
    config: { tags: any; sanitize: boolean; };
    constructor(config = {
        tags: {},
        sanitize: true
    }) {
        this.config = {
            tags: {
                h_class: [
                    'text-3xl font-bold',
                    'text-2xl font-bold',
                    'text-xl font-bold',
                    'text-lg font-bold',
                    'text-base font-bold',
                    'text-sm font-bold',
                ],
                li_class: 'list-disc list-inside',
                a_class: 'underline hover:text-blue-900 visited:text-[#d9e1ff]',
                a_img_class: 'contents',
                img_class: 'image_icon m-auto',
                p_class: 'text-lg',
                strong_class: 'font-bold',
                code_class: 'bg-gray-700 text-white border border-black px-0.5 rounded-sm ',
                lightCode_class: 'bg-gray-800 inline-block text-white p-2 rounded-lg text-justify',
                hide_class: 'cursor-pointer bg-black text-white border border-black px-0.5 rounded-sm duration-300 hide_cods',
                ...config.tags
            },
            sanitize: config.sanitize ?? true,
        };
    }

    /**
     * @param markdown файл markdown
     * @returns отформатированный текст
     * @example
     * const parse = new MarkdownParser({
     *  tags: {},
     *  sanitize: false
     * })
     * const html = parse.parse(markdown)
     */
    parse(markdown: string): string {
        let html = markdown;

        const replacements: { pattern: RegExp; replacement: (match: any, ...args: any[]) => string; }[] = [
            {
                //<h>
                pattern: /^(#+)\s+(.*)$/gm,
                replacement: (match: any, hashes: string | any[], text: string) => this._hTags(hashes, text)
            },
            {
                //<a>
                pattern: /\[\A\s(.*?)\]\((.*?)\)/gm,
                replacement: (match: any, text: any, href: any) => this._aTags(text, href)
            },
            {
                //<img>
                pattern: /\[\I\s(.*?)\]\((.*?)\)/gm,
                replacement: (match: any, text: any, href: any) => this._imgTags(text, href)
            },
            {
                //<a><img></a>
                pattern: /\[\I,\A\s(.*?)\]\((.*?)\)?\((.*?)\)/gm,
                replacement: (match: any, text: string, src: any, a_href: any) => this._aImgTags(text, src, a_href)
            },
            {
                //<strong>
                pattern: /\*\*(.*?)\*\*/gm,
                replacement: (match: any, text: any) => this._StrongTags(text),
            },
            {
                //<li>
                pattern: /^\*(.*?)$/gm,
                replacement: (match: any, text: any) => this._liTags(text),
            },
            {
                //<del></del>
                pattern: /\~\~(.*?)\~\~/gm,
                replacement: (match: any, text: any) => this._delTags(text),
            },
            {
                //<span style="text-decoration: underline">
                pattern: /\*(.*?)\*/gm,
                replacement: (match: any, text: any) => this._underTags(text),
            },
            {
                //<span id="hide" data-id="{длина}-{рандом}" style="--tw-text-opacity:0">Скрытый текст</span> реализовывать отображение скрытого текста через внешний js 
                pattern: /\?\!(.+?)\!\?/gm,
                replacement: (match: any, text: any) => this._spoilerTags(text),
            },
            {
                //<code>
                pattern: /\`(.*?)\`(?=\s|\<p|\<h|$)/gm,
                replacement: (match: any, codeText: any) => this._codeTags(codeText),
            },
            {
                //<lcode>
                pattern: /^\s*[&lt;|<]lcode[&gt;|>](.*)[&lt;|<]\/lcode[&gt;|>]$/gm,
                replacement: (match: any, codeText: any) => this.lcode(match, codeText),
            },
            {
                //<br>
                pattern: /^\n$|(\!br)/gm,
                replacement: () => this._brTags(),
            },
            {
                //<p>
                pattern: /^(?![<h|<p|<a|<li|!br|\s])([\S](.*))$/gm,
                replacement: (match: any, text: any) => this._pTags(text),
            },

        ];
        // Применяем все замены
        replacements.forEach(({ pattern, replacement }) => {
            html = html.replace(pattern, replacement);
        });

        // Санитизация
        return this.config.sanitize ? this.sanitize(html) : html
    }

    // Вспомогательные методы
    private escapeHtml = (text: string) => {
        if (/<(\/?)(h1|h2|h3|h4|h5|h6|li|p|strong|code|a|img)\b[^>]*>/gmi.test(String(text))) {
            return text;
        } else {
            return text.replace(/<!/gm, "&lt;").replace(/>/gm, "&gt;")
        }
    }
    
    private sanitize = (html: any): string => {
        return DOMPurify.sanitize(html);
    }
    // Теги
    private _hTags = (hashes: string | any[], text: string) => {
        return `<h${hashes.length} ${this.config.tags.h_class && `class="${this.config.tags.h_class[hashes.length - 1]}"`}>${text}</h${hashes.length}>`;
    }

    private _aTags = (text: string, href: string) => {
        return `<a href="${href}" ${this.config.tags.a_class && `class="${this.config.tags.a_class}"`} id="link_html">${text}</a>`
    }

    private _imgTags = (text: string, src: string) => {
        return `<img src="${src}" alt="${text}" ${this.config.tags.img_class && `class="${this.config.tags.img_class}"`}"/>`
    }

    private _aImgTags = (text: string, src: string, a_href: string) => {
        return `<a href="${a_href}"  ${this.config.tags.a_img_class && `class="${this.config.tags.a_img_class}"`} target="_blank"><img src="${src}" alt="${text.toLocaleLowerCase() ?? 'img'}" ${text && `id="${text}"`} ${this.config.tags.img_class && `class="${this.config.tags.img_class}"`}/>${text}</a>`
    }

    private _StrongTags = (text: string) => {
        return `<strong ${this.config.tags.strong_class && `class="${this.config.tags.strong_class}"`}>${text}</strong>`
    }

    private _liTags = (text: string) => {
        return `<li ${this.config.tags.li_class && `class="${this.config.tags.li_class}"`}>${this.escapeHtml(text)}</li>`
    }

    private _delTags = (text: string) => {
        return `<del>${text}</del>`
    }

    private _underTags = (text: string) => {
        return `<span style="text-decoration: underline">${this.escapeHtml(text)}</span>`
    }

    private _spoilerTags = (text: string) => {
        return `<code data-id="${text.length}-${Math.random().toFixed(2)}" id="hide" style="--tw-text-opacity:0" ${this.config.tags.hide_class && `class="${this.config.tags.hide_class}"`}>${this.escapeHtml(text)}</code>`
    }

    private _codeTags = (text: string) => {
        return `<code ${this.config.tags.code_class && `class="${this.config.tags.code_class}"`}>${text}</code>`
    }

    private _pTags = (text: string) => {
        return `<p ${this.config.tags.p_class && `class="${this.config.tags.p_class}"`}>${this.escapeHtml(text)}</p>`
    }

    private _brTags = () => {
        return `<br>`
    }

    private lcode = (match: any, codeText: any) => {
        codeText = codeText.replace(/\\n/gm, '<br>');

        let code_lang
        if (codeText.match(/^(js|php)/) !== null) {
            code_lang = codeText.match(/^(js|php)/)[0];
        } else {
            code_lang = 'js';
        }
        if (code_lang) {
            const color: any = {
                js: {
                    'function': '#ff7b72',
                    'name_function': '#d2a8ff',
                    'func_var': '#3c9bff',
                    'let': '#ff7b72',
                    'const': '#ff7b72',
                    'var': '#ff7b72',
                    'string': '#eaaa82',//a5d6ff
                    'return': '#ff7b72',
                    'ht_elem': '#7ee787',
                    'ht_attr': '#6bbbff',
                    'id': '#ff7b72',
                    'ht_class': '#ff7b72',
                    'comment': '#6a9955',
                    '`': '#eaaa82',
                    'null': '#90c6ff',
                    'class': '#0ff',
                    'async': '#ff7b72',
                    'await': '#d2a8ff',
                    'import': '#ff7b72',
                    'from': '#ff7b72',
                },
                php: {
                    'function': '#ff7b72',
                    'echo': '#ff7b72',
                    'name_function': '#d2a8ff',
                    'const': '#ff7b72',
                    'string': '#eaaa82',//a5d6ff
                    'return': '#ff7b72',
                    'variable': '#a5d6ff',
                    'null': '#90c6ff',
                    'class': '#0ff',
                    'if': '#d2a8ff',
                    'else': '#d2a8ff',
                    'comment': '#6a9955',
                    'ht_class': '#ff7b72',
                    'ht_attr': '#6bbbff',
                    'ht_elem': '#7ee787',
                    'php': '#ff7b72',
                    'template_string': '#7ee787'
                },
            };
            codeText = codeText.replace(/^(js|php)/, '').replace(/^\s+/, '');
            const words = codeText.split(' ');
            const transformedCodeText = words.map((word: any, index: number) => {
                const wordColor = color[code_lang][word.replace(/<br>/gsm, '')] || 'white';
                word = word.replace(/(__)/g, ' ');
                if (/\\r/.test(word)) {
                    return word.replace(/\\r/gsm, '   ');
                }

                //if (/}?\s*else\s*{?/gsm.test(word)) { return word.replace(/(}?\s*)(else)(\s*{?)/gsm, `$1<span style="color:${color[code_lang]['name_function']}">$2</span>$3`); }
                if (/\belse\b/.test(word)) {
                    return word.replace(/\belse\b/gsm, `<span style="color:${color[code_lang]['name_function']}">$&</span>`);
                }


                if (/^<br>$/.test(word)) {
                    return word;
                }


                if (/\b\w+\s*\(/.test(word)) {
                    let transformedWord = word;

                    transformedWord = transformedWord.replace(/(['"\`]).*?\1/gsm, `<span style="color:${color[code_lang]['string']}">$&</span>`);
                    transformedWord = transformedWord.replace(/(\w+)::/gsm, `<span style="color:${color[code_lang]['class']}">$1</span>::`);
                    transformedWord = transformedWord.replace(/(null)/g, `<span style="color:${color[code_lang]['null']}">$&</span>`);
                    transformedWord = transformedWord.replace(/(\$[a-zA-Z0-9_]+)/g, `<span style="color:${color[code_lang]['variable']}">$&</span>`);
                    transformedWord = transformedWord.replace(/\b(\w+)\s*\(/gsm, `<span style="color:${color[code_lang]['name_function']}">$1</span>(`);
                    transformedWord = transformedWord.replace(/(\$\{)(.*?)(\})/gm, `<span style="color:${color[code_lang]['func_var']}">$1<span style="color:white">$2</span>$3</span>`);
                    transformedWord = transformedWord.replace(/(window|document|this)/gsm, `<span style="color:${color[code_lang]['const']}">$1</span>`);
                    transformedWord = transformedWord.replace(/(console)/gsm, `<span style="color:${color[code_lang]['const']}">$1</span>`);
                    transformedWord = transformedWord.replace(/([A-Z][a-zA-Z0-9_]+\.)/gsm, `<span style="color:${color[code_lang]['class']}">$1</span>`);
                    transformedWord = transformedWord.replace(/\/?(div|button)/gsm, `<span style="color:${color[code_lang]['ht_elem']}">$&</span>`);
                    return transformedWord;
                }

                if (/([A-Z][a-zA-Z0-9_]+\.)/.test(word)) {
                    return word.replace(/([A-Z][a-zA-Z0-9_]+\.)/gsm, `<span style="color:${color[code_lang]['class']}">$1</span>`);
                }
                if (/(window|document|this)/.test(word)) {
                    return word.replace(/(window|document|this)/gsm, `<span style="color:${color[code_lang]['const']}">$1</span>`);
                }

                if (/(['"\`]).*?(['"\`])/.test(word)) {
                    let transformedWord = word;

                    transformedWord = transformedWord.replace(/(<\!|&lt;\!)/gsm, "&lt;");
                    transformedWord = transformedWord.replace(/(['"\`]).*?\1/gm, `<span style="color:${color[code_lang]['string']}">$&</span>`);
                    transformedWord = transformedWord.replace(/\s*(class|id|data-\w+)/gm, `<span style="color:${color[code_lang]['ht_attr']}">$1</span>`);
                    transformedWord = transformedWord.replace(/(\$\{)(.*?)(\})/gm, `<span style="color:${color[code_lang]['func_var']}">$1<span style="color:white">$2</span>$3</span>`);
                    transformedWord = transformedWord.replace(/(\$[a-zA-Z0-9_]+)/gm, `<span style="color:${color[code_lang]['variable']}">$&</span>`);
                    transformedWord = transformedWord.replace(/\/?(div|button)/gsm, `<span style="color:${color[code_lang]['ht_elem']}">$&</span>`);

                    return transformedWord;
                }

                if (/\/?(div|button)/.test(word)) {
                    let transformedWord = word;

                    transformedWord = transformedWord.replace(/(<\!|&lt;\!)/gsm, "&lt;");
                    transformedWord = transformedWord.replace(/(['"`]).*?\1/gsm, `<span style="color:${color[code_lang]['string']}">$&</span>`);

                    transformedWord = transformedWord.replace(/\s*(class|id|data-\w+)/gsm, `<span style="color:${color[code_lang]['ht_attr']}">$1</span>`);
                    return transformedWord.replace(/\/?(div|button)/gsm, `<span style="color:${color[code_lang]['ht_elem']}">$&</span>`);
                }

                if (/(class|id|data-\w+|component|fallback)/.test(word)) {
                    let transformedWord = word;
                    transformedWord = transformedWord.replace(/(['"\`]).*?\1/gsm, `<span style="color:${color[code_lang]['string']}">$&</span>`);
                    transformedWord = transformedWord.replace(/\s*(class|id|data-\w+|component|fallback)/, `<span style="color:${color[code_lang]['ht_attr']}">$1</span>`);
                    return transformedWord;
                }

                if (/^\/\/(.*?)\/\//.test(word)) {
                    let transformedWord = word;
                    transformedWord = transformedWord.replace(/\/\/(.*?)\/\//gsm, `<span style="color:${color[code_lang]['comment']}">$1</span>`);
                    return transformedWord;
                }

                if (/\$(.*?)/.test(word)) {
                    let transformedWord = word;
                    transformedWord = transformedWord.replace(/(\$[a-zA-Z0-9_]+)/gsm, `<span style="color:${color[code_lang]['variable']}">$&</span>`);
                    return transformedWord
                }

                if (/async|await/.test(word)) {
                    let transformedWord = word;
                    transformedWord = transformedWord.replace(/(async|await)/gsm, `<span style="color:${color[code_lang][word]}">$&</span>`);
                    return transformedWord
                }

                if (/private|protected|public|new|as|trait|class/.test(word)) {
                    let transformedWord = word;
                    transformedWord = transformedWord.replace(/(private|protected|public|new|as|trait|class)/g, `<span style="color:${color[code_lang]['function']}">$&</span>`);
                    return transformedWord
                }

                if (/^(\s|)&lt;(.*?)&gt;/gsm.test(word)) {
                    let tags = word;
                    let tags_inner = tags.replace(/&lt;([^>]*?)&gt;/gsm, `&lt;$1&gt;`);
                    let transformedWord = tags_inner.replace(/&lt;(.*?)&gt;/gsm, (match: string, name: string) => {
                        if (name.slice(0, 1) === '!' && name.slice(0, 3) !== '!--') {
                            return `<span>&lt;<span style="color:${color[code_lang]['ht_elem']}">${name.slice(1)}</span>&gt;</span>`
                        } else {
                            return `<span>&lt;<span style="color:${color[code_lang]['ht_elem']}">${name}</span>&gt;</span>`
                        }
                    });
                    return transformedWord
                }
                //start js

                if (/\$\{(.*?)\}/.test(word)) {
                    let transformedWord = word;
                    transformedWord = transformedWord.replace(/(\$\{)(.*?)(\})/gsm, `<span style="color:${color[code_lang]['func_var']}">$1<span style="color:white">$2</span>$3</span>`);
                    return transformedWord
                }

                //end js

                if (/(<\!+\?php|&lt;\!+\?php|\?&gt;)/.test(word)) {
                    let transformedWord = word;
                    transformedWord = transformedWord.replace(/(<\!+|&lt;\!+)\?php/gsm, `<span style="color:${color[code_lang]['php']}">&lt;?php</span>`);
                    transformedWord = transformedWord.replace(/\?&gt;/gsm, `<span style="color:${color[code_lang]['php']}">?&gt;</span>`);
                    return transformedWord
                }

                if (/@?{{(.*?)}}/.test(word)) {
                    let transformedWord = word;
                    transformedWord = transformedWord.replace(/(@?{{)(.*?)(}})/gsm, `<span style="color:${color[code_lang]['template_string']}">$1</span><span style="color:${color[code_lang]['string']}">$2</span><span style="color:${color[code_lang]['template_string']}">$3</span>`);
                    return transformedWord
                }

                return `<span style="color:${wordColor};">${word}</span>`;
            }).join(' ');
            return `<pre><code class="${this.config.tags.code_lang} ${this.config.tags.lightCode_class} ">${transformedCodeText}</code></pre>`
        } else {
            return `<code ${this.config.tags.code_class && `class="${this.config.tags.code_class}"`}">${codeText}</code>`
        }
    }
}

// Использование
export default MarkdownParser;