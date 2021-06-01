using System.Collections.Generic;
using System.Threading.Tasks;
using ZwajApp.API.Helper;
using ZwajApp.API.Models;

namespace ZwajApp.API.Data
{
    public interface IZwajRepository
    {
        void Add<T>(T entity) where T : class;
        void Delete<T>(T entity) where T : class;
        Task<bool> SaveAll();
        Task<PagedList<User>> GetUsers(PagenationParams pagenationParams);
        Task<User> GetUser(int id);
        Task<Photo> GetPhoto(int id);
        Task<Photo> GetPhotoByUser(int UserId);
        Task<Like> GetLike(int userId, int recipientId);
    }
}