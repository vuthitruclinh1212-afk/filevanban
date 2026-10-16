export interface SampleContent {
  id: string;
  title: string;
  subtitle: string;
  themeId: string;
  author: string;
  organization: string;
  content: string;
}

export const SAMPLE_CONTENTS: SampleContent[] = [
  {
    id: 'fairytale-sample',
    title: 'Huyền Thoại Ánh Sao Vĩnh Cửu',
    subtitle: 'Biên niên sử về vương quốc mộng mơ và người bảo hộ bầu trời',
    themeId: 'fairytale',
    author: 'Nguyễn Thiên Vũ',
    organization: 'Hội Những Người Kể Chuyện Cổ Tích',
    content: `Ngày xửa ngày xưa, tại một vùng đất nằm ẩn sau những làn sương bạc của Rừng Sao Băng, có một ngọn tháp cổ mang tên Tháp Thiên Cương.

Tại nơi ấy, các Tinh Linh Ánh Sáng canh giữ ngọn lửa vĩnh cửu – nguồn năng lượng duy trì sự ấm áp và bình yên cho khắp muôn loài trần thế.

Mỗi khi màn đêm buông xuống, những đóa hoa dạ nguyệt lại nở rộ, tỏa hương thơm ngát hòa cùng tiếng hát ngân vang của các vì tinh tú lấp lánh trên vòm trời cao vời vợi.

Chàng hiệp sĩ trẻ mang theo trái tim dũng cảm và thanh gươm nạm ngọc lưu ly, bước chân qua muôn trùng bão tuyết để tìm lại mảnh ngọc ước nguyện bị thời gian lãng quên.

Cuộc hành trình không chỉ thử thách lòng kiên định mà còn mở ra những chân lý kỳ diệu về tình bạn, lòng bao dung và ánh sáng chân thật của tâm hồn.`,
  },
  {
    id: 'cophong-sample',
    title: 'Vãn Cảnh Sơn Thủy & Trà Đạo',
    subtitle: 'Ghi chép về phong vị tao nhã, cỏ cây và lòng người an yên',
    themeId: 'cophong',
    author: 'Tuệ Tĩnh Cư Sĩ',
    organization: 'Thanh Phong Trà Quán',
    content: `Mưa đầu mùa lất phất qua rèm trúc, thoảng hương trà sen sớm còn vương chút khói sương bảng lảng chốn hiên đình.

Cổ nhân từng dạy: "Tâm tĩnh tắc thấu triệt, ý định tắc tự thông." Mỗi chén trà thanh tao là một nhịp thở chậm rãi giữa dòng đời vội vã.

Bên chiếc bàn gỗ mộc mạc, ngọn bút lông chấm mực tàu nhẹ nhàng lướt trên tờ giấy dó ngả vàng, phác họa lại dải mây chiều lãng đãng vờn qua đỉnh núi biếc.

Tiếng đàn tranh réo rắt từ xa vọng lại, thanh thoát như nước chảy mây trôi, xua tan bao bụi trần và muộn phiền thường nhật.

Trăng thu soi sáng mặt hồ phẳng lặng như gương. Người ở lại thưởng chén thanh trà, lòng thong dong mỉm cười cùng vạn vật.`,
  },
  {
    id: 'candy-sample',
    title: 'Nhật Ký Ý Tưởng Sáng Tạo 2026',
    subtitle: 'Khám phá thế giới ngọt ngào với những sắc màu truyền cảm hứng',
    themeId: 'candy',
    author: 'Lê Mai Anh',
    organization: 'Studio Kẹo Dẻo & Thiết Kế',
    content: `Chào mừng bạn đến với vương quốc sắc màu pastel ngập tràn niềm vui và sự ngọt ngào!

Hôm nay chúng mình cùng nhau phác thảo dự án "Hộp Kẹo Niềm Vui", mang lại nguồn cảm hứng tích cực cho mỗi ngày làm việc.

Ý tưởng thiết kế chủ đạo: Tone hồng dâu ngọt lịm kết hợp cùng xanh bạc hà mát rượi, tạo cảm giác thư giãn và thân thiện như một que kem mùa hạ.

Các hoạt động thú vị: Workshop làm nến thơm vị vanilla, sáng tạo sổ tay handmade và chia sẻ những câu chuyện ấm áp cùng bạn bè.

Hãy luôn giữ nụ cười thật tươi trên môi và tô điểm cho cuộc sống bằng những điều đáng yêu nhất nhé!`,
  },
  {
    id: 'minimal-sample',
    title: 'Kế Hoạch Đổi Mới Kỹ Thuật Số',
    subtitle: 'Chiến lược tối ưu hóa quy trình làm việc và tự động hóa tài liệu',
    themeId: 'minimal',
    author: 'Ban Chiến Lược Công Nghệ',
    organization: 'Tập Đoàn Giải Pháp Số',
    content: `1. Mục tiêu chiến lược: Chuyển đổi toàn diện phương thức quản trị và lưu trữ tài liệu trong kỷ nguyên số.

2. Trọng tâm thực thi: Tự động hóa việc tạo lập văn bản chuẩn mực, báo cáo thuyết trình và dữ liệu bảng tính với tốc độ cao.

3. Chuẩn hóa trải nghiệm: Đảm bảo tính nhất quán về thẩm mỹ, bảng màu nhận diện và độ chuẩn xác của font chữ trên mọi nền tảng Word, PowerPoint, Excel và PDF.

4. Đo lường hiệu quả: Giảm 85% thời gian định dạng thủ công và nâng cao sự hài lòng của các phòng ban nghiệp vụ.

5. Định hướng tương lai: Tích hợp khả năng xuất dữ liệu theo thời gian thực và đồng bộ hóa đám mây đa thiết bị.`,
  },
];
