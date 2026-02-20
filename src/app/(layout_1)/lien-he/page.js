import {DISCORD_URL, FACEBOOK_URL, INSTAGRAM_URL, SUPPORT_EMAIL, TELEGRAM_URL, X_URL} from "@/constants/social";
import Link from "next/link";
import {getMetadata} from "@/utils/metadata";
import H1Tags from "@/components/layout/H1Tags";

const pageMetadata = async () => {
  return await getMetadata({page: "contact"})
}

export async function generateMetadata({params}) {
  const {title, description, metadataBase, openGraph} = await pageMetadata()
  return {
    title,
    description,
    metadataBase,
    openGraph: {
      ...openGraph
    },
    alternates: {
      canonical: `/lien-he`
    }
  }
}

const ContactPage = async () => {
  const {h1} = await pageMetadata()

  return (
    <div id="wrapper">
      <H1Tags text={h1}/>
      <div className="fluid-gap">
        <div className="cards-row fixed contact-page">
          <div className="row-header">
            <h3 className="category-name w-100 text-center">Liên hệ</h3>
          </div>
          <div className="row-content">
            <p>Chào mừng bạn đến với trang <b>Liên Hệ</b> của RoPhim! Chúng tôi luôn sẵn sàng lắng nghe và hỗ trợ bạn để
              mang lại trải nghiệm tốt nhất khi sử dụng dịch vụ. Nếu có bất kỳ câu hỏi, góp ý, hoặc yêu cầu hỗ trợ nào,
              hãy liên hệ với chúng tôi qua các thông tin dưới đây. </p>
            <p>&nbsp;</p>

            <h3 className="heading-sm">1. Thông Tin Liên Hệ Chính</h3>
            <p>Email hỗ trợ khách hàng: <a href={`mailto:${SUPPORT_EMAIL}`}><b>{SUPPORT_EMAIL}</b></a></p>
            <ul>
              <li><b>Vấn đề tài khoản:</b> Quên mật khẩu, không thể truy cập, và các vấn đề liên quan đến tài khoản.
              </li>
              <li><b>Hỗ trợ kỹ thuật:</b> Sự cố khi xem phim, chất lượng video hoặc các lỗi khác khi sử dụng trang web.
              </li>
              <li><b>Đóng góp ý kiến:</b> Chúng tôi trân trọng mọi ý kiến đóng góp từ bạn để nâng cao chất lượng dịch
                vụ.
              </li>
            </ul>
            <p>Email liên hệ về Chính Sách Riêng Tư: <a href={`mailto:${SUPPORT_EMAIL}`}><b>{SUPPORT_EMAIL}</b></a></p>
            <p>Mọi thắc mắc liên quan đến bảo mật thông tin và chính sách riêng tư của RoPhim.</p>
            <p>&nbsp;</p>

            <h3 className="heading-sm">2. Liên Hệ Qua Mạng Xã Hội </h3>
            <p>Ngoài email, bạn cũng có thể liên hệ và cập nhật thông tin mới nhất từ RoPhim qua các kênh mạng xã hội
              của chúng tôi: </p>
            <div className="mb-2">
              <div className="line-center btn btn-sm btn-light">
                <div className="inc-icon icon-14">
                  <img src="/images/social/telegram-icon-black.svg" alt="Telegram"/>
                </div>
                <span>Telegram:</span>
                <a className="text-dark text-start name-short" href={TELEGRAM_URL} title={`Telegram`}
                   target="_blank">{TELEGRAM_URL}</a>
              </div>
            </div>
            <div className="mb-2">
              <div className="line-center btn btn-sm btn-light">
                <div className="inc-icon icon-14">
                  <img src="/images/social/discord-icon-black.svg" alt="Discord"/>
                </div>
                <span>Discord:</span>
                <a className="text-dark text-start name-short" href={DISCORD_URL} title={`Discord`}
                   target="_blank">{DISCORD_URL}</a>
              </div>
            </div>
            <div className="mb-2">
              <div className="line-center btn btn-sm btn-light">
                <div className="inc-icon icon-14">
                  <img src="/images/social/facebook-icon-black.svg" alt="Facebook"/>
                </div>
                <span>Facebook:</span>
                <a className="text-dark text-start name-short" href={FACEBOOK_URL} title={`Facebook`}
                   target="_blank">{FACEBOOK_URL}</a>
              </div>
            </div>
            <div className="mb-2">
              <div className="line-center btn btn-sm btn-light">
                <div className="inc-icon icon-14">
                  <img src="/images/social/instagram-icon-black.svg" alt="Instagram"/>
                </div>
                <span>Instagram:</span>
                <a className="text-dark text-start flex-grow-1 name-short" href={INSTAGRAM_URL} title={`Instagram`}
                   target="_blank">{INSTAGRAM_URL}</a>
              </div>
            </div>
            <div className="mb-3">
              <div className="line-center btn btn-sm btn-light">
                <div className="inc-icon icon-14">
                  <img src="/images/social/x-icon-black.svg" alt="X"/>
                </div>
                <span>X:</span>
                <a className="text-dark text-start name-short" href={X_URL} title={`X`}
                   target="_blank">{X_URL}</a>
              </div>
            </div>
            <p>&nbsp;</p>

            <h3 className="heading-sm">4. Câu Hỏi Thường Gặp (F.A.Q) </h3>
            <p>Trước khi gửi yêu cầu hỗ trợ, bạn có thể tham khảo trang <Link href="/hoi-dap"><b>Câu Hỏi Thường Gặp
              (F.A.Q)</b></Link> để tìm câu trả lời nhanh cho các vấn đề phổ biến nhất tại <b>F.A.Q - RoPhim.</b></p>
            <p>Chúng tôi rất vui khi được hỗ trợ bạn và mong muốn mang đến trải nghiệm xem phim trực tuyến tốt nhất! <b>RoPhim
              - Cùng bạn khám phá thế giới giải trí đa dạng, an toàn và miễn phí!</b></p>

            <p>&nbsp;</p>

          </div>
        </div>
      </div>
    </div>
  )
}

export default ContactPage