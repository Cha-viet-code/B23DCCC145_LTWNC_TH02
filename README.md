## Hoàn thành trong checkpoint

- React + TypeScript, React Router v6. Đủ đường dẫn trong đề, ba trang sau đang là trang tạm.
- Sinh đúng bộ 10.000 bài tập tại cấp module, không tạo lại khi render.
- FixedSizeList của react-window v1: chiều cao 560px, dòng 56px, overscanCount=2, itemKey dùng exercise.id.
- useDebounce<T>: trì hoãn tìm kiếm 300ms, tìm theo tên bài hoặc huấn luyện viên, không phân biệt hoa thường.
- Lọc nhóm cơ, sắp xếp tên theo locale vi và thời lượng, thông báo số lượng và không có kết quả.
- useMemo cho tính lọc/sắp xếp và itemData; useCallback cho handler; React.memo cho dòng và danh sách.
- Dòng đầu App.tsx và tên handleKeywordShift đúng yêu cầu.
- Cấu hình Vitest/RTL và 12 test cho những chức năng đã có. Các test bắt buộc về session/reducer/form sẽ bổ sung ở Phần 4. Có 12 test lúc này KHÔNG đồng nghĩa hoàn thành Phần 4.

## Chưa làm trong checkpoint

Nút Bắt đầu chỉ ghi nhận bài đã chọn, chưa chạy đồng hồ. Hai nút ☆ và + Buổi tập bị khóa đến Phần 2. Trang /saved, /routines và /routines/:id mới là trang tạm. Chưa có giáo án, dark mode, lazy load, coverage.png. Không nộp checkpoint này thay bản cuối.

## Thứ tự đọc code

| File                                 | Nhiệm vụ                                             |
| ------------------------------------ | ---------------------------------------------------- |
| src/types.ts                         | Quy định cấu trúc Exercise và nhóm cơ                |
| src/data/exercises.ts                | Hàm sinh dữ liệu đúng đề, EXERCISES khởi tạo một lần |
| src/utils/format.ts                  | Đổi số giây thành phút:giây                          |
| src/hooks/useDebounce.ts             | Giữ giá trị cũ đến khi ngừng gõ đủ 300ms             |
| src/features/library/ExerciseRow.tsx | Hiển thị một dòng, nhận callback qua props           |
| src/features/library/LibraryPage.tsx | State bộ lọc, tính kết quả và danh sách ảo hóa       |
| src/App.tsx                          | Menu NavLink và khai báo route                       |
| src/main.tsx                         | Gắn BrowserRouter và mount React                     |
| vite.config.ts, src/setupTests.ts    | Cấu hình build/test                                  |

## Luồng hoạt động tìm kiếm

1. Người dùng gõ, handleKeywordShift cập nhật keyword ngay để ô nhập phản hồi.
2. Hook đặt setTimeout 300ms. Gõ tiếp thì cleanup hủy timeout cũ.
3. Chưa đủ 300ms: debouncedKeyword không đổi, useMemo trả kết quả cũ. itemData và callback cũng giữ tham chiếu cũ, nên danh sách đã memo không render lại.
4. Sau 300ms: debouncedKeyword đổi, useMemo lọc lại danh sách theo từ khóa và nhóm cơ, rồi sắp xếp trên bản sao.
5. FixedSizeList chỉ dựng các dòng đang nhìn thấy và vài dòng dự phòng, không dựng cả 10.000 dòng.
6. Thay bộ lọc thì đưa danh sách về đầu để tránh giữ vị trí cuộn cũ.

ExerciseList được memo riêng vì react-window cung cấp style dạng object cho mỗi dòng. Tách như vậy giúp chặn cả việc tạo lại style trong lúc đang gõ mà chưa hết debounce.

## Tự kiểm tra Phần 1

| Thao tác                           | Mong đợi                                       |
| ---------------------------------- | ---------------------------------------------- |
| Mở /                               | Tìm thấy 10000 bài tập                         |
| Gõ đẩy, chờ 300ms                  | 1250 bài                                       |
| Giữ đẩy, chọn Vai                  | 250 bài                                        |
| Chọn Tất cả, gõ đức anh            | 1000 bài                                       |
| Gõ xyz                             | Không tìm thấy bài tập nào                     |
| Xóa tìm kiếm, chọn Tất cả, sắp tên | Dòng đầu Bật chậm 1                            |
| Chọn thời lượng tăng               | Dòng đầu 0:30                                  |
| Cuộn xuống cuối                    | Vẫn có dữ liệu, không dựng toàn bộ 10.000 dòng |

Trong DevTools > Console, chạy:

```js
document.querySelectorAll("[data-exercise-id]").length;
```

Kết quả khoảng 12–14 tùy vị trí cuộn, không phải 10000. Trong React DevTools > Settings > Highlight updates when components render, các dòng không sáng lại mỗi phím gõ trước khi đủ 300ms.

## Thiết kế tham khảo

Bố cục tìm kiếm + lọc nhóm cơ + thư viện lấy cảm hứng từ Hevy (https://www.hevyapp.com/features/exercise-library/). Giao diện desktop được tự xây bằng CSS, màu xanh và bảng gọn, không sao chép source hay tài sản của Hevy. Không cần backend, đăng nhập hoặc cơ sở dữ liệu cho bài này.

## Lộ trình tiếp theo

1. Commit Phan 1: checkpoint hiện tại.
2. Phan 2: Zustand session, đồng hồ tách CountdownBar, saved persist.
3. Phan 3: reducer/Context giáo án, logger, theme, lazy routes.
4. Phan 4: đủ toàn bộ nhóm test, coverage Lines >=70% cho features và utils, ảnh coverage.png.
