using System.Threading.Tasks;
using ZwajApp.API.Models;

namespace ZwajApp.API.Data
{
    public interface IAuthRepository
    {
        // Create method
        Task<User> Register(User user, string password);

        // Access to system
        Task<User> Login(string username, string password);

        // chek user name is exist in the database
        Task<bool> UserExists(string username);

    }
}