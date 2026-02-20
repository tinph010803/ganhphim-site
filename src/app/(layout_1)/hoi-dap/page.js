import {getMetadata} from "@/utils/metadata";
import H1Tags from "@/components/layout/H1Tags";

const pageMetadata = async () => {
  return  await getMetadata({page: "faq"})
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
      canonical: `/hoi-dap`
    }
  }
}

const FaqPage = async () => {
  const {h1} = await pageMetadata()

  return (
    <div id="wrapper">
      <H1Tags text={h1}/>
      <div className="fluid-gap">
        <div className="cards-row fixed min">
          <div className="row-header">
            <h2 className="category-name">Một số câu hỏi được người dung quan tâm nhất tại Rophim – Phim hay cả rổ</h2>
          </div>
          <div className="row-content">
            <div className="article-body">
              <ul className="question-box">
                <li>
                  <a href="#faq-01" title="">1. RoPhim là gì và có những đặc điểm nổi bật nào? </a>
                </li>
                <li>
                  <a href="#faq-02" title="">2. RoPhim có miễn phí hoàn toàn không? </a>
                </li>
                <li>
                  <a href="#faq-03" title="">3. RoPhim có bao gồm các bộ phim chiếu rạp không?</a>
                </li>
                <li>
                  <a href="#faq-04" title="">4. Tốc độ tải phim trên RoPhim như thế nào?</a>
                </li>
                <li>
                  <a href="#faq-05" title="">5. Chất lượng phim trên RoPhim có tốt không?</a>
                </li>
                <li>
                  <a href="#faq-06" title="">6. RoPhim có thể xem trên các thiết bị nào?</a>
                </li>
                <li>
                  <a href="#faq-07" title="">7. RoPhim có hỗ trợ thuyết minh và phụ đề không?</a>
                </li>
                <li>
                  <a href="#faq-08" title="">8. RoPhim có quảng cáo trong quá trình xem phim không?</a>
                </li>
                <li>
                  <a href="#faq-09" title="">9. Có thể tìm thấy phim của những quốc gia nào trên RoPhim?</a>
                </li>
                <li>
                  <a href="#faq-10" title="">10. Những thể loại phim nào phổ biến nhất trên RoPhim? </a>
                </li>
                <li>
                  <a href="#faq-11" title="">11. RoPhim có cập nhật phim mới không?</a>
                </li>
                <li>
                  <a href="#faq-12" title="">12. RoPhim có phim lẻ và phim bộ không?</a>
                </li>
                <li>
                  <a href="#faq-13" title="">13. RoPhim có hỗ trợ phim hoạt hình không? </a>
                </li>
                <li>
                  <a href="#faq-14" title="">14. Có thể tìm kiếm phim dễ dàng trên RoPhim không?</a>
                </li>
                <li>
                  <a href="#faq-15" title="">15. RoPhim có cung cấp phim 4K không?</a>
                </li>
                <li>
                  <a href="#faq-16" title="">16. RoPhim có hỗ trợ lồng tiếng giọng địa phương không?</a>
                </li>
                <li>
                  <a href="#faq-17" title="">17. RoPhim có các bộ phim được xem nhiều nhất không?</a>
                </li>
                <li>
                  <a href="#faq-18" title="">18. Tại sao nên chọn RoPhim thay vì các trang web khác?</a>
                </li>
                <li>
                  <a href="#faq-19" title="">19. Có cần đăng ký tài khoản để xem phim trên RoPhim không?</a>
                </li>
                <li>
                  <a href="#faq-20" title="">20. RoPhim có bảo vệ quyền riêng tư cho người dùng không?</a>
                </li>
              </ul>
              <p>&nbsp;</p>

              <h3 id="faq-01" className="heading-sm text-primary">1. RoPhim là gì và có những đặc điểm nổi bật
                nào? </h3>
              <p>
                RoPhim là một trang web xem phim online miễn phí tại Việt Nam, cung cấp kho phim chất lượng HD và 4K,
                không quảng cáo và có tốc độ tải mượt mà. Trang web này có giao diện thân thiện với người dùng và thường
                xuyên cập nhật các bộ phim mới nhất từ nhiều quốc gia.
              </p>
              <p>&nbsp;</p>

              <h3 id="faq-02" className="heading-sm text-primary">2. RoPhim có miễn phí hoàn toàn không? </h3>
              <p>RoPhim hoàn toàn miễn phí. Người dùng không cần trả phí hay đăng ký tài khoản để xem phim, giúp khán
                giả thoải mái lựa chọn và trải nghiệm hàng ngàn bộ phim chất lượng cao mà không tốn bất kỳ khoản phí
                nào. </p>
              <p>&nbsp;</p>

              <h3 id="faq-03" className="heading-sm text-primary">3. RoPhim có bao gồm các bộ phim chiếu rạp
                không? </h3>
              <p>RoPhim cung cấp nhiều bộ phim chiếu rạp đình đám từ Việt Nam và quốc tế. Các bộ phim này được cập nhật
                nhanh chóng để đáp ứng nhu cầu xem phim của khán giả. </p>
              <p>&nbsp;</p>

              <h3 id="faq-04" className="heading-sm text-primary">4. Tốc độ tải phim trên RoPhim như thế nào?</h3>
              <p>RoPhim có tốc độ tải nhanh, ổn định nhờ hệ thống máy chủ hiện đại, giúp người xem trải nghiệm phim
                online mà không bị gián đoạn bởi tình trạng chậm hoặc lag.</p>
              <p>&nbsp;</p>

              <h3 id="faq-05" className="heading-sm text-primary">5. Chất lượng phim trên RoPhim có tốt không? </h3>
              <p>RoPhim cung cấp chất lượng phim từ HD đến 4K, giúp người dùng thưởng thức hình ảnh sắc nét, sống động
                và chân thực nhất có thể. </p>
              <p>&nbsp;</p>

              <h3 id="faq-06" className="heading-sm text-primary">6. RoPhim có thể xem trên các thiết bị nào? </h3>
              <p>RoPhim có thể được truy cập trên các thiết bị như máy tính, điện thoại di động và máy tính bảng, giúp
                người dùng xem phim mọi lúc, mọi nơi.</p>
              <p>&nbsp;</p>

              <h3 id="faq-07" className="heading-sm text-primary">7. RoPhim có hỗ trợ thuyết minh và phụ đề không? </h3>
              <p>Có, RoPhim hỗ trợ nhiều tùy chọn thuyết minh và phụ đề đa ngôn ngữ, phù hợp với nhu cầu của đa dạng
                người xem và giúp cải thiện khả năng học ngoại ngữ. </p>
              <p>&nbsp;</p>

              <h3 id="faq-08" className="heading-sm text-primary">8. RoPhim có quảng cáo trong quá trình xem phim
                không?</h3>
              <p>RoPhim hoàn toàn không có quảng cáo trong quá trình xem phim, giúp khán giả tận hưởng phim liền mạch mà
                không bị gián đoạn.</p>
              <p>&nbsp;</p>

              <h3 id="faq-09" className="heading-sm text-primary">9. Có thể tìm thấy phim của những quốc gia nào trên
                RoPhim? </h3>
              <p>RoPhim cung cấp phim từ nhiều quốc gia, bao gồm Việt Nam, Hàn Quốc, Trung Quốc, Nhật Bản, Thái Lan, Âu
                Mỹ và nhiều quốc gia khác, với đa dạng thể loại cho người xem lựa chọn.</p>
              <p>&nbsp;</p>

              <h3 id="faq-10" className="heading-sm text-primary">10. Những thể loại phim nào phổ biến nhất trên
                RoPhim? </h3>
              <p>Các thể loại phim được yêu thích trên RoPhim gồm: hành động, tình cảm, khoa học viễn tưởng, cổ trang,
                hoạt hình, kinh dị, võ thuật và tâm lý. RoPhim có kho phim phong phú đáp ứng sở thích của mọi đối tượng
                khán giả. </p>
              <p>&nbsp;</p>

              <h3 id="faq-11" className="heading-sm text-primary">11. RoPhim có cập nhật phim mới không? </h3>
              <p>Có, RoPhim cập nhật các bộ phim mới liên tục 24/24, đảm bảo người dùng không bỏ lỡ các bộ phim hot nhất
                từ các rạp chiếu hay trên truyền hình. </p>
              <p>&nbsp;</p>

              <h3 id="faq-12" className="heading-sm text-primary">12. RoPhim có phim lẻ và phim bộ không? </h3>
              <p>Đúng vậy, RoPhim cung cấp cả phim lẻ và phim bộ, bao gồm các bộ phim truyền hình dài tập và phim điện
                ảnh nổi tiếng từ nhiều quốc gia. </p>
              <p>&nbsp;</p>

              <h3 id="faq-13" className="heading-sm text-primary">13. RoPhim có hỗ trợ phim hoạt hình không? </h3>
              <p>Có, RoPhim có một kho phim hoạt hình phong phú, bao gồm các phim hoạt hình nổi tiếng từ Âu Mỹ và phim
                anime Nhật Bản, phục vụ cả trẻ em lẫn người lớn.</p>
              <p>&nbsp;</p>

              <h3 id="faq-14" className="heading-sm text-primary">14. Có thể tìm kiếm phim dễ dàng trên RoPhim
                không? </h3>
              <p>Giao diện của RoPhim được thiết kế thân thiện và tối ưu, giúp người dùng dễ dàng tìm kiếm phim theo tên
                phim, thể loại, quốc gia và các danh mục khác. </p>
              <p>&nbsp;</p>

              <h3 id="faq-15" className="heading-sm text-primary">15. RoPhim có cung cấp phim 4K không? </h3>
              <p>RoPhim là một trong số ít trang web tại Việt Nam cung cấp các bộ phim chất lượng 4K, giúp người xem
                trải nghiệm hình ảnh sắc nét như tại rạp chiếu phim.</p>
              <p>&nbsp;</p>

              <h3 id="faq-16" className="heading-sm text-primary">16. RoPhim có hỗ trợ lồng tiếng giọng địa phương
                không?</h3>
              <p>RoPhim cung cấp tùy chọn lồng tiếng giọng miền Bắc, Trung và Nam, giúp người xem dễ dàng lựa chọn theo
                sở thích cá nhân. </p>
              <p>&nbsp;</p>

              <h3 id="faq-17" className="heading-sm text-primary">17. RoPhim có các bộ phim được xem nhiều nhất
                không?</h3>
              <p>RoPhim thường xuyên cập nhật danh sách những bộ phim được xem nhiều nhất, bao gồm cả phim hot trong
                nước và phim nổi tiếng quốc tế, giúp người xem dễ dàng lựa chọn những bộ phim thịnh hành. </p>
              <p>&nbsp;</p>

              <h3 id="faq-18" className="heading-sm text-primary">18. Tại sao nên chọn RoPhim thay vì các trang web
                khác?</h3>
              <p>RoPhim không chỉ miễn phí, không quảng cáo, mà còn có kho phim phong phú với chất lượng HD và 4K. Tốc
                độ tải nhanh và giao diện dễ sử dụng là những ưu điểm khiến RoPhim trở thành lựa chọn hàng đầu cho người
                yêu thích phim online. </p>
              <p>&nbsp;</p>

              <h3 id="faq-19" className="heading-sm text-primary">19. Có cần đăng ký tài khoản để xem phim trên RoPhim
                không? </h3>
              <p>Người dùng không cần đăng ký tài khoản mà vẫn có thể xem phim thoải mái. RoPhim giúp tối ưu hóa trải
                nghiệm người dùng, không cần thông tin đăng nhập. </p>
              <p>&nbsp;</p>

              <h3 id="faq-20" className="heading-sm text-primary">20. RoPhim có bảo vệ quyền riêng tư cho người dùng
                không? </h3>
              <p>RoPhim đảm bảo quyền riêng tư của người dùng, không yêu cầu cung cấp thông tin cá nhân và không sử dụng
                dữ liệu của người dùng cho các mục đích quảng cáo. </p>
              <p>&nbsp;</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FaqPage