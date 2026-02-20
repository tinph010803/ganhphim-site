import dayjs from "./dayjs";
import {Bounce, toast} from "react-toastify"
import {v4 as uuidv4} from 'uuid'
import {isMobile} from "react-device-detect"
import {Filter} from 'bad-words'
import listBadWords from "../constants/badWords"
import striptags from "striptags";
import slugify from "slugify"
import Cookies from "js-cookie";

const filter = new Filter({list: listBadWords, regex: /\*|\.|$/gi})

const currentTimestamp = () => {
    return dayjs().unix()
}

const isProduction = process.env.APP_ENV === "production";

const showToast = ({message, type = 'default'}) => {
    const config = {
        position: "bottom-right",
        autoClose: 6000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce
    }
    if (type === 'default') {
        toast(message, config)
    } else {
        toast[type](message, config)
    }
}

const mergeErrors = (errors) => {
    let error = ''
    for (const [key, value] of Object.entries(errors)) {
        error += `${value}`
    }

    return error
}

const createUuid = () => {
    return uuidv4()
}

const timeAgo = (timestamp) => {
    return dayjs(dayjs.unix(timestamp)).fromNow();
}

const formatDuration = (minutes) => {
    if (minutes) {
        const hours = Math.floor(minutes / 60)
        const remainingMinutes = Math.ceil(minutes % 60)
        const formattedMinutes = remainingMinutes < 10 ? `0${remainingMinutes}` : remainingMinutes
        if (hours > 0) {
            return `${hours}h ${formattedMinutes}m`
        }

        return `${formattedMinutes}m`
    }
}

const scrollToCommentSection = () => {
    window.scrollTo({
        behavior: 'smooth',
        top:
            document.getElementById("comment-area").getBoundingClientRect().top -
            document.body.getBoundingClientRect().top -
            (isMobile ? 10 : 80),
    })
}

const playerPostMessage = (data) => {
    const iframe = document.getElementById('embed-player')
    // console.log(data)
    iframe.contentWindow.postMessage(data, "*")
}

const timeStringToSeconds = (str) => {
    const arr = str.split(":");
    if (arr.length === 2) {
        return +arr[0] * 60 + +arr[1];
    }
    if (arr.length === 3) {
        return +arr[0] * 60 * 60 + +arr[1] * 60 + +arr[2];
    }
    return 0;
}

const filterBadWords = (text) => {
    try {
        const segmenter = new Intl.Segmenter(['vi'], {granularity: 'word'});
        const segmentedText = segmenter.segment(text)
        const words = [...segmentedText].map(s => s.segment)

        return words
            .map(word => {
                return listBadWords.includes(word.toLowerCase()) ? '*'.repeat(word.length) : word;
            })
            .join('')
    } catch (e) {

    }

    return text
}

const commentProcessing = (str, detectTimeStr = true) => {
    str = filterBadWords(str)
    if (detectTimeStr) {
        const regex = /(0?[1-2]:)?[0-5]?\d:[0-5]?\d/g;
        const found = str.match(regex);

        if (found && found.length > 0) {
            found.forEach(item => {
                str = str.replace(item, `<a style="color: yellow !important;" href="javascript:;" class="seek-time" data-time="${timeStringToSeconds(item)}">${item}</a>`);
            })
        }
    }
    return str
}

const chatProcessing = (content) => {
    const regex = /\[img(?<attrs>(?:\s+[a-z-]+="[^"]*")*)\](?<url>https:\/\/media\.tenor\.com\/[^\]]+)\[\/img\]/i
    const match = content.match(regex);

    if (match) {
        const attrStr = match[1] || '';           // ví dụ: width="128" height="128"
        const url = match[2];

        const width = attrStr.match(/width="(\d+)"/)?.[1];
        const height = attrStr.match(/height="(\d+)"/)?.[1];

        // Dùng width/height để trình duyệt biết tỉ lệ từ đầu -> chống layout shift
        const sizeAttrs = [
            width ? `width="${width}"` : null,
            height ? `height="${height}"` : null
        ].filter(Boolean).join(' ');

        return `<img src="${url}" ${sizeAttrs} class="sticker-inline" loading="lazy" decoding="async"/>`;
    }

    return striptags(content);
}

// đọc image từ dataURL/file URL
const createImage = (url) => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.addEventListener("load", () => resolve(img));
        img.addEventListener("error", (e) => reject(e));
        img.src = url;
    });
}

// render crop ra blob webp, xuất ảnh vuông EXPORT_SIZE x EXPORT_SIZE
const getCroppedBlob = async (imageSrc, croppedAreaPixels, mime = "image/webp", size = 512, quality = 0.92) => {
    const img = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");

    // clear
    ctx.fillStyle = "#00000000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const {x, y, width, height} = croppedAreaPixels;

    // vì aspect = 1 nên không méo, scale crop vào khung size x size
    ctx.drawImage(
        img,
        x, y, width, height,   // vùng lấy từ ảnh gốc
        0, 0, size, size       // vùng vẽ ra canvas
    );

    return await new Promise((resolve) =>
        canvas.toBlob((blob) => resolve(blob), mime, quality)
    );
}

// nén dần để đạt targetSize (<= 1MB)
const compressToTarget = async (imageSrc, croppedAreaPixels, mime, size, targetSize) => {
    let quality = 0.9;
    let lastBlob = await getCroppedBlob(imageSrc, croppedAreaPixels, mime, size, quality);
    while (lastBlob.size > targetSize && quality > 0.5) {
        quality -= 0.1;
        lastBlob = await getCroppedBlob(imageSrc, croppedAreaPixels, mime, size, quality);
    }
    // nếu vẫn lớn, giảm thêm kích thước xuất (tối thiểu 256)
    let outSize = size;
    while (lastBlob.size > targetSize && outSize > 256) {
        outSize = Math.floor(outSize * 0.85);
        lastBlob = await getCroppedBlob(imageSrc, croppedAreaPixels, mime, outSize, quality);
    }
    return lastBlob;
}

const compactNumber = (input, opts = {}) => {
    const {decimals = 1, mode = 'round', trimZeros = true} = opts;

    const n = Number(input);
    if (!Number.isFinite(n)) return '';

    const sign = n < 0 ? '-' : '';
    const units = ['', 'K', 'M', 'B', 'T'];

    let abs = Math.abs(n);
    let i = 0;

    // Chia từng bậc 1000 để tránh lỗi biên và sai số log
    while (abs >= 1000 && i < units.length - 1) {
        abs /= 1000;
        i++;
    }

    const factor = 10 ** Math.max(0, decimals);
    let scaled;
    if (mode === 'floor') scaled = Math.floor(abs * factor) / factor;
    else if (mode === 'trunc') scaled = Math.trunc(abs * factor) / factor;
    else scaled = Math.round(abs * factor) / factor;

    // Rollover: 999.5K -> 1000K -> 1M
    if (scaled >= 1000 && i < units.length - 1) {
        scaled = scaled / 1000;
        i++;
    }

    // toFixed để giữ số thập phân, sau đó cắt đuôi 0 nếu cần
    let str = decimals > 0 ? scaled.toFixed(decimals) : String(Math.round(scaled));
    if (trimZeros && str.includes('.')) str = str.replace(/\.?0+$/, '');

    return sign + str + units[i];
}

const randomEven10Digits = () => {
    const now = Math.floor(Date.now() / 1000);   // UNIX seconds (10 chữ số)
    const min = now - 2 * 3600;                  // 2 giờ trước

    // Chuẩn hoá biên về số chẵn
    const start = (min % 2 === 0) ? min : min + 1;
    const maxEven = (now % 2 === 0) ? now : now - 1;

    if (start > maxEven) throw new Error("No even number in the range");

    // Số lượng giá trị chẵn trong khoảng
    const count = Math.floor((maxEven - start) / 2) + 1;

    // Chọn ngẫu nhiên chỉ số [0..count-1]
    const idx = Math.floor(Math.random() * count);
    return start + 2 * idx;
}

const genSlug = (str) => {
    return slugify(str, {
        lower: true,
        strict: true,
        locale: 'en'
    })
}

const isQuocKhanhActiveNow = () => {
    const now = dayjs().tz("Asia/Ho_Chi_Minh");
    const y = now.year();
    const start = dayjs.tz(`${y}-09-01 18:00`, "YYYY-MM-DD HH:mm", "Asia/Ho_Chi_Minh");
    const end = dayjs.tz(`${y}-09-02 23:59`, "YYYY-MM-DD HH:mm", "Asia/Ho_Chi_Minh");
    return now.isAfter(start) && now.isBefore(end);
}

export {
    currentTimestamp,
    showToast,
    isProduction,
    mergeErrors,
    createUuid,
    timeAgo,
    formatDuration,
    scrollToCommentSection,
    playerPostMessage,
    commentProcessing,
    chatProcessing,
    getCroppedBlob,
    compressToTarget,
    compactNumber,
    randomEven10Digits,
    genSlug,
    isQuocKhanhActiveNow,
}