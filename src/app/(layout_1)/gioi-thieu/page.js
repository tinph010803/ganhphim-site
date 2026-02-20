import {SUPPORT_EMAIL} from "@/constants/social";
import Link from "next/link";
import {getMetadata} from "@/utils/metadata";
import H1Tags from "@/components/layout/H1Tags";

const pageMetadata = async () => {
  return await getMetadata({page: "about"})
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
      canonical: `/gioi-thieu`
    }
  }
}

const AboutPage = async () => {
  const {h1} = await pageMetadata()

  return (
    <div id="wrapper">
      <H1Tags text={h1}/>
      <div className="fluid-gap">
        <div className="cards-row fixed min">
          <div className="row-header">
            <h2 className="category-name">RoPhim - Nền Tảng Xem Phim Trực Tuyến Miễn Phí</h2>
          </div>
          <div className="row-content">
            <div className="article-body">
              <p>RoPhim là nền tảng xem phim trực tuyến miễn phí, cung cấp một không gian giải trí đỉnh cao cho hàng
                triệu người dùng với tiêu chí chất lượng, tiện lợi và phong phú. Được thành lập với sứ mệnh đem lại trải
                nghiệm giải trí hoàn toàn miễn phí, RoPhim đã và đang trở thành điểm đến quen thuộc cho những người yêu
                thích phim ảnh từ khắp nơi. </p>
              <p>&nbsp;</p>

              <h3 className="heading-sm">Giao Diện Thân Thiện, Dễ Sử Dụng</h3>
              <p>
                RoPhim thiết kế giao diện tối giản, thân thiện để bạn dễ dàng khám phá và tìm kiếm những bộ phim yêu
                thích. Chỉ với vài thao tác đơn giản, bạn có thể truy cập vào kho phim đa dạng của chúng tôi và thưởng
                thức những nội dung giải trí đỉnh cao, mọi lúc mọi nơi.
              </p>
              <p>&nbsp;</p>

              <h3 className="heading-sm">Kho Phim Phong Phú, Đáp Ứng Mọi Thể Loại </h3>
              <p>RoPhim mang đến cho bạn hàng ngàn bộ phim thuộc nhiều thể loại, từ hành động,lãng mạn, khoa học viễn
                tưởng, hoạt hình, đến kinh dị và phiêu lưu. Không ngừng cập nhật, chúng tôi cam kết đem đến cho bạn
                những bộ phim mới nhất và chất lượng nhất.</p>
              <p>Kho phim phong phú của RoPhim bao gồm: </p>
              <ul className="v-ul">
                <li>
                  Phim Bộ: Từ các series kinh điển đến các bộ phim truyền hình mới nhất, bạn có thể thưởng thức liên tục
                  những tập phim hay.
                </li>
                <li>
                  Phim Lẻ: Những bộ phim điện ảnh đình đám, từ phim bom tấn Hollywood, châu Á đến những bộ phim độc lập
                  hấp dẫn.
                </li>
                <li>
                  Phim Việt Nam: Đáp ứng nhu cầu của người yêu phim Việt, chúng tôi luôn cập nhật các bộ phim Việt Nam
                  mới và nổi tiếng.
                </li>
              </ul>
              <p>&nbsp;</p>

              <h3 className="heading-sm">Chất Lượng Video Đỉnh Cao - Từ HD đến 4K </h3>
              <p>Chất lượng hình ảnh là một trong những yếu tố quan trọng trong trải nghiệm giải trí, vì vậy RoPhim cung
                cấp phim với nhiều độ phân giải khác nhau từ HD đến 4K, đảm bảo phù hợp với tốc độ internet và nhu cầu
                của từng người xem. Với video sắc nét, âm thanh sống động, RoPhim cam kết mang đến cho bạn trải nghiệm
                chân thực như đang xem phim tại rạp.</p>
              <p>&nbsp;</p>

              <h3 className="heading-sm">Tính Năng Nổi Bật của RoPhim</h3>
              <ul className="v-ul">
                <li>
                  Xem Phim Miễn Phí Hoàn Toàn: RoPhim hoạt động với phương châm phục vụ cộng đồng, bạn sẽ không phải chi
                  trả bất kỳ khoản phí nào để truy cập và xem phim.
                </li>
                <li>
                  Cập Nhật Phim Nhanh Chóng: Đội ngũ của chúng tôi làm việc không ngừng nghỉ để cập nhật những bộ phim
                  mới nhất, giúp bạn luôn đón đầu xu hướng.
                </li>
                <li>
                  Xem Phim Mọi Lúc, Mọi Nơi: Hỗ trợ đa nền tảng từ máy tính, điện thoại đến các thiết bị thông minh
                  khác, bạn có thể xem phim mọi lúc, mọi nơi.
                </li>
              </ul>
              <p>&nbsp;</p>

              <h3 className="heading-sm">Cam Kết của RoPhim</h3>
              <p>Chúng tôi cam kết bảo vệ quyền lợi người dùng với chất lượng dịch vụ tốt nhất. RoPhim không ngừng phát
                triển và cải thiện để đem lại trải nghiệm xem phim hoàn hảo. An toàn và bảo mật của người dùng luôn là
                ưu tiên hàng đầu của chúng tôi, vì vậy chúng tôi đảm bảo thông tin cá nhân của bạn luôn được bảo mật
                tuyệt đối. </p>
              <p>&nbsp;</p>

              <h3 className="heading-sm">Liên Hệ với RoPhim</h3>
              <p>Để biết thêm chi tiết hoặc có thắc mắc về dịch vụ, bạn vui lòng liên hệ với chúng tôi qua email <a
                href={`mailto:${SUPPORT_EMAIL}`}><b>{SUPPORT_EMAIL}</b></a> hoặc qua trang <Link href="/lien-he"><b>Liên
                Hệ</b></Link> trên website chính thức của chúng tôi. </p>
              <p>&nbsp;</p>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AboutPage