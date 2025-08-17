<?php

namespace App\Http\Controllers;

use App\Models\GalleryItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class GalleryItemController extends Controller
{
    public function index()
    {
        return GalleryItem::with('user')->latest()->get();
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048'
        ]);

        $imagePath = $request->file('image')->store('gallery', 'public');

        $galleryItem = GalleryItem::create([
            'title' => $request->title,
            'description' => $request->description,
            'image_path' => $imagePath,
            'user_id' => auth()->id()
        ]);

        return response()->json($galleryItem, 201);
    }

    public function show(GalleryItem $galleryItem)
    {
        return $galleryItem->load('user');
    }

    public function update(Request $request, GalleryItem $galleryItem)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string'
        ]);

        $galleryItem->update($request->only(['title', 'description']));

        return response()->json($galleryItem);
    }

    public function destroy(GalleryItem $galleryItem)
    {
        if ($galleryItem->image_path) {
            Storage::disk('public')->delete($galleryItem->image_path);
        }
        
        $galleryItem->delete();
        return response()->noContent();
    }

    public function userGallery()
    {
        return GalleryItem::where('user_id', auth()->id())
            ->latest()
            ->get();
    }
} 