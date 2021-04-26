using System.Collections.Generic;
using Newtonsoft.Json;
using ZwajApp.API.Models;

namespace ZwajApp.API.Data
{
    public class TrialData
    {
        private readonly DataContext _context;
        public TrialData(DataContext context)
        {
            _context = context;
        }
        public void TrialUsers()
        {
            try
            {
                var userData = System.IO.File.ReadAllText("Data/UserTrialData.json");
                var users = JsonConvert.DeserializeObject<List<User>>(userData);
            foreach (var user in users)
            {
                byte[] passwordHash, passwordSalt;
                CreatePasswordHash("password", out passwordHash, out passwordSalt);
                user.PasswordHash = passwordHash;
                user.PasswordSalt = passwordSalt;
                user.Username = user.Username.ToLower();
                _context.Add(user);
            }
            _context.SaveChanges();

            }
            catch (System.Exception)
            {

                throw;
            }


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

    }
}