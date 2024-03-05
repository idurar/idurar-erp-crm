# IDURAR Phần mềm ERP & CRM mã nguồn mở

GitHub: [https://github.com/idurar/idurar-erp-crm](https://github.com/idurar/idurar-erp-crm)
Demo: [https://www.idurarapp.com/open-source-erp-crm/](https://www.idurarapp.com/open-source-erp-crm/)
Trang web: [https://www.idurarapp.com](https://www.idurarapp.com)

## Cấu trúc phần mềm

IDURAR là ứng dụng ERP & CRM mã nguồn mở miễn phí, dựa trên "mern-stack": Node.js React.js Redux Express.js MongoDB AntDesign (AntD)

## Quản lý người dùng:

- Cho phép quản trị viên tạo, chỉnh sửa và xóa tài khoản người dùng.
- Thực hiện kiểm soát quyền truy cập dựa trên vai trò để quản lý quyền hạn của người dùng.
- Cung cấp cơ chế xác thực và ủy quyền để đảm bảo quyền truy cập an toàn.

## Quản lý mối quan hệ khách hàng (CRM):

- Cho phép người dùng tạo và quản lý thông tin liên hệ cho khách hàng tiềm năng và khách hàng.
- Thực hiện chức năng tạo và xác định tiềm năng bán hàng để theo dõi cơ hội bán hàng tiềm năng.
- Cung cấp công cụ quản lý lịch sử giao tiếp với khách hàng, bao gồm email, cuộc gọi và cuộc họp.
- Cho phép người dùng lên lịch hẹn và gửi thông báo hoặc nhắc nhở cho khách hàng.

## Quản lý bán hàng:

- Cho phép người dùng tạo và quản lý đơn hàng bán hàng, liên kết chúng với khách hàng cụ thể.
- Thực hiện theo dõi hàng tồn kho để kiểm tra tình trạng hàng hóa và cập nhật mức tồn sau mỗi giao dịch bán hàng.
- Tạo hóa đơn và xử lý tích hợp thanh toán với các cổng thanh toán phổ biến.
- Cung cấp bảng điều khiển và báo cáo để theo dõi hiệu suất bán hàng và phân tích xu hướng.

## Quản lý mua hàng:

- Cho phép người dùng tạo và quản lý đơn đặt hàng, xác định số lượng và sản phẩm mong muốn.
- Theo dõi thông tin nhà cung cấp và quản lý mối quan hệ với nhà cung cấp.
- Nhận hàng và cập nhật mức tồn kho tương ứng.
- Xử lý hóa đơn mua hàng và thanh toán cho nhà cung cấp.

## Quản lý hàng tồn kho:

- Cung cấp công cụ để quản lý và theo dõi mức tồn kho, bao gồm chuyển kho và điều chỉnh.
- Thiết lập thông báo tự động cho mức tồn kho thấp và tạo đơn đặt hàng khi cần phải nhập kho.
- Cung cấp khả năng quét mã vạch để quản lý hàng tồn kho hiệu quả.
- Cho phép người dùng phân loại sản phẩm, xác định thuộc tính và thiết lập thông tin giá cả.

## Quản lý tài chính:

- Thực hiện hệ thống sổ cái chung để theo dõi giao dịch tài chính, bao gồm chi phí và doanh thu.
- Quản lý công nợ và công nợ phải trả, bao gồm lập hóa đơn và theo dõi thanh toán.
- Tạo báo cáo tài chính, bao gồm bảng cân đối kế toán và báo cáo thu nhập.
- Tích hợp với phần mềm kế toán phổ biến để quản lý tài chính một cách liền mạch.

## Quản lý dự án:

- Cung cấp khả năng quản lý dự án, cho phép người dùng tạo và theo dõi dự án.
- Giao nhiệm vụ cho thành viên nhóm, đặt hạn chế và theo dõi tiến độ.
- Phân bổ tài nguyên và theo dõi chi phí dự án.
- Cung cấp tính năng hợp tác như chia sẻ tài liệu và giao tiếp thời gian thực.

## Báo cáo và phân tích:

- Tạo báo cáo và phân tích chi tiết về các khía cạnh khác nhau của doanh nghiệp.
- Cung cấp bảng điều khiển tùy chỉnh để theo dõi các chỉ số hiệu suất chính (KPI).
- Cho phép người dùng xác định báo cáo tùy chỉnh dựa trên yêu cầu cụ thể.
- Thực hiện các kỹ thuật trực quan hóa dữ liệu để trình bày thông tin một cách hấp dẫn mắt.

## Tích hợp và tùy chỉnh:

- Cho phép tích hợp với các ứng dụng hoặc API của bên thứ ba phổ biến, chẳng hạn như các công cụ email marketing hoặc nền tảng CRM.
- Cho phép tùy chỉnh chức năng và giao diện ứng dụng dựa trên nhu cầu kinh doanh cụ thể.
- Cung cấp API hoặc webhooks để tạo điều kiện trao đổi dữ liệu giữa ứng dụng ERP & CRM và các hệ thống khác.

## Giao diện thân thiện với người dùng:

- Thiết kế giao diện trực quan, đáp ứng và thân thiện với người dùng bằng cách sử dụng React.js và Ant Design.
- Thực hiện các menu điều hướng, chức năng tìm kiếm và bộ lọc dễ sử dụng.
- Đảm bảo giao diện người dùng nhất quán và hấp dẫn trực quan trên các thiết bị và kích thước màn hình khác nhau.