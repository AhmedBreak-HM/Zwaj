using System;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ZwajApp.API.Models;

namespace ZwajApp.API.Data
{
    public class AuthRepository : IAuthRepository
    {
        private readonly DataContext _context;

        public AuthRepository(DataContext context)
        {
            _context = context;
        }
        public async Task<User> Login(string username, string password)
        {
            // chek user name is exists
            var user = await _context.Users.FirstOrDefaultAsync(x => x.Username == username);
            if (user == null) return null;
            // chek password hash equal passord
            if (!VerifyPasswordHash(password, user.PasswordSalt, user.PasswordHash)) return null;
            return user;
        }



        public async Task<User> Register(User user, string password)
        {
            // To passing this params to method CreatePasswordHash
            byte[] passwordHash, passwordSalt;

            // Invok method to return passwordHash And passwordHash
            CreatePasswordHash(password, out passwordHash, out passwordSalt);

            // Maping user proprity
            user.PasswordSalt = passwordSalt;
            user.PasswordHash = passwordHash;

            // Saving user to database
            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();
            return user;
        }
        public async Task<bool> UserExists(string username)
        {
            // var isUser = await _context.Users.FindAsync(username);
            // var user = await _context.Users.FirstOrDefaultAsync(x => x.Name == username);
            var user = await _context.Users.AnyAsync(x => x.Username == username);
            
            return user;
            // return user != null ? true : false;
        }

        // this method genreated hash and salt from string password by using HMACSHA512()
        private void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            using (var hmac = new System.Security.Cryptography.HMACSHA512())
            {
                // TO get salt from hmac
                passwordSalt = hmac.Key;
                // To convert password string to Hashing
                passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            }

        }
        private bool VerifyPasswordHash(string password, byte[] passwordSalt, byte[] passwordHash)
        {
            using (var hmac = new System.Security.Cryptography.HMACSHA512(passwordSalt))
            {
                // Genreate new password by usinge passwordSalt
                var ComputedHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
                for (int i = 0; i < ComputedHash.Length; i++)
                {
                    if (ComputedHash[i] != passwordHash[i]) return false;
                }
                return true;
            }
        }
    }
}