import Link from "next/link";
import {SUPPORT_EMAIL} from "@/constants/social";
import {getMetadata} from "@/utils/metadata";
import H1Tags from "@/components/layout/H1Tags";

const pageMetadata = async () => {
  return await getMetadata({page: "terms"})
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
      canonical: `/dieu-khoan-su-dung`
    }
  }
}

const TermsPage = () => {
  const {h1} = pageMetadata()

  return (
    <div id="wrapper">
      <H1Tags text={h1}/>
      <div className="fluid-gap">
        <div className="cards-row fixed min">
          <div className="row-header">
            <h2 className="category-name">Điều Khoản Sử Dụng - RoPhim</h2>
          </div>
          <div className="row-content">
            <div className="article-body">
              <p>Chào mừng bạn đến với RoPhim – Phim hay cả rổ, nền tảng xem phim trực tuyến miễn phí hàng đầu. Để đảm
                bảo
                trải nghiệm tốt nhất cho tất cả người dùng, RoPhim xây dựng và duy trì các điều khoản sử dụng dưới đây.
                Bằng việc truy cập và sử dụng dịch vụ của RoPhim, bạn đồng ý tuân thủ các điều khoản này. Vui lòng đọc
                kỹ để hiểu rõ quyền và nghĩa vụ của bạn.</p>
              <p>&nbsp;</p>

              <h3 className="heading-sm">1. Chấp Nhận Điều Khoản Sử Dụng</h3>
              <p>
                Khi sử dụng dịch vụ của RoPhim, bạn chấp nhận rằng. Bạn đã đọc, hiểu và đồng ý với các điều khoản sử
                dụng này. Nếu bạn không đồng ý với bất kỳ điều khoản nào, vui lòng không tiếp tục truy cập hoặc sử dụng
                RoPhim.
              </p>
              <p>&nbsp;</p>

              <h3 className="heading-sm">2. Đăng Ký Tài Khoản </h3>
              <p>Khi đăng ký tài khoản tại RoPhim, bạn cam kết:</p>
              <ul className="v-ul">
                <li>
                  Cung cấp thông tin chính xác, đầy đủ và luôn cập nhật.
                </li>
                <li>
                  Bảo mật thông tin đăng nhập của mình. RoPhim không chịu trách nhiệm cho bất kỳ mất mát hoặc thiệt hại
                  nào liên quan đến việc tiết lộ thông tin tài khoản.
                </li>
                <li>
                  Không sử dụng tài khoản của mình để thực hiện các hành vi vi phạm pháp luật hoặc gây tổn hại cho
                  RoPhim và người dùng khác.
                </li>
              </ul>
              <p>&nbsp;</p>

              <h3 className="heading-sm">3. Hành Vi Bị Cấm </h3>
              <p>Khi sử dụng RoPhim, bạn đồng ý không:</p>
              <ul className="v-ul">
                <li>
                  Đăng tải, chia sẻ hoặc phát tán bất kỳ nội dung nào vi phạm quyền sở hữu trí tuệ, pháp luật hoặc quyền
                  riêng tư của người khác. .
                </li>
                <li>
                  Thực hiện các hành vi gây hại cho hệ thống, cố gắng truy cập trái phép vào máy chủ hoặc tài khoản của
                  người dùng khác.
                </li>
                <li>
                  Sử dụng RoPhim với mục đích thương mại mà không có sự đồng ý bằng văn bản từ chúng tôi.
                </li>
              </ul>
              <p>&nbsp;</p>

              <h3 className="heading-sm">4. Bảo Mật Thông Tin</h3>
              <p>RoPhim cam kết bảo vệ thông tin cá nhân của bạn. Vui lòng tham khảo <Link
                href="/chinh-sach-bao-mat"><b>Chính
                Sách Riêng Tư</b></Link> của chúng tôi để hiểu rõ cách chúng tôi thu thập, sử dụng và bảo mật thông tin
                cá
                nhân của bạn. </p>
              <p>&nbsp;</p>

              <h3 className="heading-sm">5. Quyền Thay Đổi Dịch Vụ</h3>
              <p>RoPhim có quyền: </p>
              <ul className="v-ul">
                <li>
                  Thay đổi, cập nhật hoặc ngừng cung cấp bất kỳ nội dung hoặc dịch vụ nào trên nền tảng mà không cần
                  thông báo trước.
                </li>
                <li>
                  Xóa bỏ hoặc tạm ngừng tài khoản của bạn nếu phát hiện hành vi vi phạm các điều khoản sử dụng hoặc các
                  quy định pháp luật có liên quan.
                </li>
              </ul>
              <p>&nbsp;</p>

              <h3 className="heading-sm">6. Miễn Trừ Trách Nhiệm </h3>
              <p>RoPhim cam kết nỗ lực cung cấp dịch vụ với chất lượng tốt nhất, nhưng chúng tôi không chịu trách nhiệm
                về: </p>
              <li>
                Bất kỳ gián đoạn nào trong quá trình truy cập hoặc sự cố kỹ thuật.
              </li>
              <li>
                Nội dung do bên thứ ba cung cấp hoặc bất kỳ lỗi hay mất mát nào do sử dụng nội dung trên RoPhim.
              </li>
              <li>
                Các thiệt hại gián tiếp, ngẫu nhiên hoặc hậu quả phát sinh từ việc sử dụng hoặc không thể sử dụng dịch
                vụ của chúng tôi.
              </li>
              <p>&nbsp;</p>

              <h3 className="heading-sm">7. Thay Đổi Điều Khoản Sử Dụng</h3>
              <p>Chúng tôi có thể cập nhật điều khoản sử dụng theo thời gian để phù hợp với các thay đổi trong hoạt động
                và dịch vụ. Khi điều khoản thay đổi, chúng tôi sẽ đăng tải bản cập nhật lên trang web và gửi thông báo
                đến người dùng khi cần thiết. Việc tiếp tục sử dụng dịch vụ sau khi điều khoản được cập nhật đồng nghĩa
                với việc bạn đồng ý với các điều khoản mới. </p>
              <p>&nbsp;</p>

              <h3 className="heading-sm">8. Liên Hệ </h3>
              <p>Nếu bạn có bất kỳ câu hỏi hoặc thắc mắc nào liên quan đến các điều khoản sử dụng, vui lòng liên hệ với
                chúng tôi qua email: <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TermsPage