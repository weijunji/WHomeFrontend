// ==UserScript==
// @name         WHome Helper
// @namespace    http://www.weijunji.top/
// @version      0.2
// @description  one click import for whome
// @author       You
// @match        http://www.jjwxc.net/onebook.php?novelid=*
// @match        https://www.bilibili.com/bangumi/*
// @require      https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js
// @grant        GM_registerMenuCommand
// ==/UserScript==

let jq = $.noConflict()

let host = 'https://www.weijunji.top' // end without '/'

let _type, inject_node

let title,
    author,
    cover,
    introduce,
    link

let name,
    nameCn,
    ep,
    epCount,
    type,
    update = 0
//  introduce,
//  link,
//  cover

function getWeekday(text) {
    let update = 0
    const weekday = ['', '一', '二', '三', '四', '五', '六', '日']
    for (const i in weekday) {
        if (weekday[i] === text) {
            update = i
            break
        }
    }
    return update
}

if (window.location.host === "www.jjwxc.net") {
    _type = 'book'
    title = jq("span[itemprop=articleSection]").text()
    author = jq("span[itemprop=author]").text()
    cover = jq(".noveldefaultimage")[0].src
    introduce = jq("#novelintro")[0].innerText
    link = window.location.href
}

if (window.location.host === "www.bilibili.com") {
    _type = 'series'
    if (window.location.href.substr(33, 4) === 'play') {
        type = 'anim'
        nameCn = jq(".media-title").text()
        name = ''
        const ep_text = jq(".ep-list-progress").text().split('/')
        ep = ep_text[0]
        epCount = ep_text[1]
        const update_text = jq('.pub-info').text().split('周')[1][0]
        update = getWeekday(update_text)
        introduce = jq('.absolute').text()
        link = jq(".media-title")[0].href
        inject_node = jq('<div report-id="click_unfollow" class="btn-follow" style="margin-right: 10px;"><span>导入</span></div>')

        let interval = null
        interval = window.setInterval(() => {
            if (jq(".media-cover>img")[0]) {
                cover = jq(".media-cover>img")[0].src.split('@')[0]
                jq(".media-tool-bar.clearfix").prepend(inject_node)
                window.clearInterval(interval)
            }
        }, 1000)
    } else if (window.location.href.substr(33, 5) === 'media') {
        type = 'anim'
        nameCn = jq(".media-info-title-t").text()
        name = ''
        const update_text = jq(".media-info-time>span:last").text().split('周')[1][0]
        update = getWeekday(update_text)
        introduce = jq(".media-info-intro-text").text().substr(3)
        link = window.location.href
        inject_node = jq('<div class="share-module" style="height: 30px;line-height: 30px;margin-left: 20px;cursor:pointer;">导入WHome</div>')

        let interval = null
        interval = window.setInterval(() => {
            if (jq(".common-lazy-img>img")[0]) {
                let epc_text = jq(".sl-ep-nav-list:first>li:last").text().split('-')
                epc_text = epc_text.length === 1 ? epc_text[0] : epc_text[1]
                epCount = epc_text.substr(1, epc_text.length - 2)

                let ep_text = jq(".lastplay .misl-ep-index").text()
                ep = ep_text === "" ? 0 : ep_text.substr(1, ep_text.length - 2)

                cover = jq(".common-lazy-img>img")[0].src.split('@')[0]
                jq(".media-info-btns").append(inject_node)
                window.clearInterval(interval)
            }
        }, 1000)
    }
}

function oneClick () {
    if (_type === 'book') {
        let params = new URLSearchParams()
        params.append('title', title)
        params.append('author', author)
        params.append('cover', cover)
        params.append('introduce', introduce)
        params.append('link', link)
        window.open(host + '/books/new?' + params.toString(), '_blank')
    } else {
        let params = new URLSearchParams()
        params.append('nameCn', nameCn)
        params.append('name', name)
        params.append('type', type)
        params.append('ep', ep)
        params.append('epCount', epCount)
        params.append('update', update)
        params.append('cover', cover)
        params.append('introduce', introduce)
        params.append('link', link)
        window.open(host + '/series/new?' + params.toString(), '_blank')
    }
}

if (inject_node) {
    inject_node.click(oneClick)
}

GM_registerMenuCommand("一键导入", oneClick)
