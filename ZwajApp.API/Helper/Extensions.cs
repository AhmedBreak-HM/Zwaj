using System;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;

namespace ZwajApp.API.Helper
{
    public static class Extensions
    {
        // add header for http to show error with respons
        public static void AddApplicationError(this HttpResponse response, string Message)
        {
            response.Headers.Add("Application-Error", Message);
            response.Headers.Add("Access-Control-Expose-Headers", "Application-Error");
            response.Headers.Add("Access-Control-Allow-Origin", "*");
        }
        // add header for http to show Pagination information with respone
        public static void AddApplicationPagenation(this HttpResponse response, int currentPage, int itemPerPage, int totalItems, int totalPages)
        {
            var paginationHeader = new PagenationHeader(currentPage, itemPerPage, totalItems, totalPages);
            response.Headers.Add("Pagination", JsonConvert.SerializeObject(paginationHeader));
            response.Headers.Add("Access-Control-Expose-Headers", "Pagination");
        }

        // calculte age from birth day to user in mapper profil
        public static int CalculteAge(this DateTime dateTime)
        {
            var age = DateTime.Today.Year - dateTime.Year;
            if (dateTime.AddYears(age) > DateTime.Today) age--;
            return age;
        }

    }
}