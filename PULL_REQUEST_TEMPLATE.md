## Checklist Before Submitting Merge Request

Vui lòng hoàn thành checklist này trước khi tạo merge request.

---

### Developer Checklist
- [ ] Đã pull source code mới nhất từ nhánh `develop`.
- [ ] Đã xác nhận source code không có các thay đổi không cần thiết, như:
  - Khoảng trắng thừa.
  - File thừa hoặc thay đổi không liên quan đến task.

- [ ] Đặt tên title merge request và commit message theo định dạng `[prefix]([feature|screen]): [description]`
  - `[prefix]`:
      - `feat`: thêm một feature.
      - `fix`: fix bug cho hệ thống.
      - `refactor`: sửa code nhưng không fix bug cũng không thêm feature.
      - `docs`: thêm/thay đổi document.
      - `chore`: những sửa đổi nhỏ nhặt không liên quan tới code.
      - `style`: những thay đổi không làm thay đổi ý nghĩa của code như thay đổi css/ui chẳng hạn.
      - `perf`: code cải tiến về mặt hiệu năng xử lý.
      - `vendor`: cập nhật version cho các dependencies, packages.
  - `[feature|screen]`: Chức năng hoặc màn hình nằm trong scope.
  - `[description]`: Mô tả nội dung của task.
  - **Example** : `feat(user): create api create/update for user`.

- [ ] Đã tự kiểm tra và đảm bảo theo checklist.
- [ ] Đã ghi rõ ràng các lệnh cần chạy vào Merge Request.
  - `Các lệnh cần chạy : ...`

- [ ] Đã tô màu spec, chụp lại hình ảnh và đưa vào Merge Request.
- [ ] Đã tự kiểm tra lại, xác nhận không ảnh hưởng đến các chức năng khác.
- [ ] Đã đổi trạng thái task sang `Code Done` trong Backlog.
- [ ] Đã review lại code đảm bảo không có comment thừa, console log, print, dump (vd: `dd()`).

---

### Code Documentation Checklist
- [ ] **Comment định nghĩa component** : Để đánh index component khi cần tái sử dụng và biết độ ảnh hưởng.
  ```javascript
  /**
   * ID#MdOutlineShoppingCart
   * Description: NFT Marketplace
   *
   * Reference:
   * #MdBarChart - Main Dashboard
   * #MdPerson - Profile
   * #MdHome - Home
   */