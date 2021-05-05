using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using ZwajApp.API.Data;
using ZwajApp.API.Dtos;
using ZwajApp.API.Helper;
using ZwajApp.API.Models;

namespace ZwajApp.API.Controllers
{
    [Authorize]
    [Route("api/users/{userId}/photos")]
    [ApiController]
    public class PhotosController : ControllerBase
    {
        private readonly IZwajRepository _repo;
        private readonly IMapper _mapper;
        private readonly IOptions<CloudinarySettings> _cloudinaryConfig;
        private Cloudinary _cloudinary;

        public PhotosController(IZwajRepository repo,
        IOptions<CloudinarySettings> cloudinaryConfig, IMapper mapper)
        {
            _cloudinaryConfig = cloudinaryConfig;
            _mapper = mapper;
            _repo = repo;
            Account account = new Account(
                _cloudinaryConfig.Value.CloudName,
                _cloudinaryConfig.Value.APIKey,
                _cloudinaryConfig.Value.APISecret);

            _cloudinary = new Cloudinary(account);

        }

        [HttpPost]
        public async Task<IActionResult> AddPhotoForUser(int userId, PhotoForCreateDto photoForCreateDto)
        {
            var userIdFromToken = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier).Value);
            if (userIdFromToken != userId) return Unauthorized();
            var userFromRepo = await _repo.GetUser(userId);
            var file = photoForCreateDto.File;
            var result = UploadPhotoToCloudinary(file);
            photoForCreateDto.Url = result.Uri.ToString();
            photoForCreateDto.CloudinaryId = result.PublicId;
            var photo = _mapper.Map<Photo>(photoForCreateDto);
            if (!userFromRepo.Photos.Any(p => p.IsMain))
            {
                photo.IsMain = true;
            }
            _repo.Add<Photo>(photo);
            if (await _repo.SaveAll()) return Ok(photo + "  Don");
            return BadRequest("  Error in Add Photo");
        }

        private ImageUploadResult UploadPhotoToCloudinary(IFormFile file)
        {
            var uploadResult = new ImageUploadResult();
            if (file != null && file.Length > 0)
            {
                using (var stream = file.OpenReadStream())
                {
                    var uploadParams = new ImageUploadParams()
                    {
                        File = new FileDescription(file.Name, stream),
                        Transformation = new Transformation()
                        .Width(500).Height(500).Crop("fill").Gravity("face")
                    };
                    return uploadResult = _cloudinary.Upload(uploadParams);
                }
            }
            return uploadResult;
        }

    }

}