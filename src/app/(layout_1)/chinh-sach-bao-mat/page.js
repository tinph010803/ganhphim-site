import {SUPPORT_EMAIL} from "@/constants/social";
import {getMetadata} from "@/utils/metadata";
import H1Tags from "@/components/layout/H1Tags";

const pageMetadata = async () => {
  return await getMetadata({page: "policy"})
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
      canonical: `/chinh-sach-bao-mat`
    }
  }
}

const PrivacyPolicyPage = () => {
  const {h1} = pageMetadata()

  return (
    <div id="wrapper">
      <H1Tags text={h1}/>
      <div className="fluid-gap">
        <div className="cards-row fixed min">
          <div className="row-header">
            <h2 className="category-name">Bảo Mật - Chính Sách Riêng Tư của Rophim</h2>
          </div>
          <div className="row-content">
            <div className="article-body">
              <p>Tại Rophim, chúng tôi cam kết bảo vệ quyền riêng tư và thông tin cá nhân của bạn khi bạn truy cập và sử
                dụng trang web của chúng tôi. Chính sách này cung cấp chi tiết về cách chúng tôi thu thập, sử dụng và
                bảo mật thông tin, đồng thời cam kết minh bạch trong việc quản lý dữ liệu cá nhân của người dùng. </p>
              <p>&nbsp;</p>
              <h3 className="heading-sm">Thông Tin Chúng Tôi Thu Thập </h3>
              <p>
                Để cung cấp và cải thiện dịch vụ, Rophim thu thập thông tin từ người dùng thông qua nhiều hình thức, bao
                gồm:
              </p>
              <p>
                <b>Thông Tin Cá Nhân</b>: Khi bạn đăng ký tài khoản, nhận bản tin, hoặc liên hệ với chúng tôi, chúng tôi
                có thể thu thập các thông tin như tên, địa chỉ email, số điện thoại và các thông tin khác mà bạn cung
                cấp.
              </p>
              <p>&nbsp;</p>
              <h3 className="heading-sm">Mục Đích Sử Dụng Thông Tin </h3>
              <p>
                Thông tin được thu thập được sử dụng để:
              </p>
              <ul className="v-ul">
                <li>
                  <b>Cung Cấp Dịch Vụ:</b> Sử dụng thông tin để cung cấp và duy trì các dịch vụ của Rophim, xử lý các
                  yêu cầu và nâng cao trải nghiệm người dùng.

                </li>
                <li>
                  <b>Giao Tiếp với Người Dùng:</b>
                  Gửi các thông báo, bản tin, cập nhật liên quan đến dịch vụ của chúng tôi. Người dùng có thể từ chối
                  nhận các thông tin này bất kỳ lúc nào.
                </li>
                <li>
                  <b>Phân Tích và Cải Thiện:</b> Sử dụng thông tin phi cá nhân để hiểu rõ hơn về hành vi của người dùng
                  và nâng cao chất lượng trang web, sản phẩm, và dịch vụ.
                </li>
                <li>
                  <b>Bảo Mật:</b> Áp dụng các biện pháp để bảo vệ trang web và người dùng khỏi các hành vi gian lận, đảm
                  bảo an toàn thông tin và tuân thủ các yêu cầu pháp lý.
                </li>
              </ul>
              <p>&nbsp;</p>
              <h3 className="heading-sm">Chia Sẻ Thông Tin</h3>
              <p>Rophim cam kết không bán, trao đổi hoặc chia sẻ thông tin cá nhân của bạn với bất kỳ bên thứ ba nào,
                ngoại trừ trong các trường hợp sau: </p>
              <ul className="v-ul">
                <li>
                  <b>Với Sự Đồng Ý Của Bạn:</b> Chúng tôi chỉ chia sẻ thông tin cá nhân khi có sự đồng ý rõ ràng của
                  bạn.

                </li>
                <li>
                  <b>Đối Tác và Nhà Cung Cấp Dịch Vụ:</b> Chia sẻ thông tin với các đối tác và nhà cung cấp dịch vụ tin
                  cậy để hỗ trợ trong việc cung cấp dịch vụ, xử lý thanh toán, và phân tích dữ liệu.
                </li>
                <li>
                  <b>Tuân Thủ Pháp Luật:</b> Rophim có thể tiết lộ thông tin cá nhân nếu được yêu cầu theo quy định pháp
                  luật hoặc để bảo vệ quyền lợi, tài sản và an toàn của công ty và người dùng.
                </li>
              </ul>
              <p>&nbsp;</p>

              <h3 className="heading-sm">Bảo Mật Thông Tin Cá Nhân</h3>
              <p>Chúng tôi áp dụng các biện pháp kỹ thuật và tổ chức để bảo vệ thông tin cá nhân của bạn khỏi việc mất
                mát, lạm dụng, truy cập trái phép, tiết lộ và thay đổi. Tuy nhiên, mặc dù chúng tôi luôn nỗ lực tối đa,
                không có phương pháp truyền tải hay lưu trữ nào là tuyệt đối an toàn. Rophim cam kết liên tục cải tiến
                các biện pháp bảo mật để bảo vệ thông tin của bạn. </p>
              <p>&nbsp;</p>

              <h3 className="heading-sm">Quyền Riêng Tư của Người Dùng</h3>
              <p>Người dùng có quyền:</p>
              <ul className="v-ul">
                <li>
                  Truy cập, chỉnh sửa và xóa thông tin cá nhân của mình mà chúng tôi lưu giữ. Để thực hiện các quyền
                  này, vui lòng liên hệ với chúng tôi qua email: <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>.
                </li>
                <li>
                  Từ chối nhận thông báo từ Rophim bất kỳ lúc nào thông qua tùy chọn trong email hoặc liên hệ trực tiếp.
                </li>
              </ul>
              <p>&nbsp;</p>

              <h3 className="heading-sm">Cookies và Công Nghệ Tương Tự</h3>
              <p>Rophim sử dụng cookies và các công nghệ tương tự để thu thập thông tin phi cá nhân về cách bạn sử dụng
                trang web. Cookies giúp chúng tôi: </p>
              <ul className="v-ul">
                <li>
                  Cải thiện trải nghiệm người dùng bằng cách ghi nhớ sở thích của bạn.
                </li>
                <li>
                  Phân tích lưu lượng truy cập và hành vi của người dùng để cải thiện dịch vụ.
                </li>
                <li>
                  Cung cấp quảng cáo phù hợp dựa trên hoạt động của bạn.
                </li>
              </ul>
              <p>Bạn có thể điều chỉnh cài đặt cookies thông qua trình duyệt của mình hoặc tắt cookies nếu muốn. </p>
              <p>&nbsp;</p>

              <h3 className="heading-sm">Thay Đổi Chính Sách Riêng Tư </h3>
              <p>Rophim có thể cập nhật Chính Sách Riêng Tư này để phù hợp với các quy định và chính sách nội bộ mới.
                Mọi thay đổi sẽ được thông báo trên trang web và có hiệu lực ngay khi được đăng tải. Việc tiếp tục sử
                dụng trang web sau khi có thay đổi đồng nghĩa với việc bạn chấp nhận các điều khoản mới. </p>
              <p>&nbsp;</p>

              <h3 className="heading-sm">Liên Hệ </h3>
              <p>Nếu có bất kỳ câu hỏi hoặc yêu cầu nào liên quan đến Chính Sách Riêng Tư này, vui lòng liên hệ với
                chúng tôi qua email: <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PrivacyPolicyPage